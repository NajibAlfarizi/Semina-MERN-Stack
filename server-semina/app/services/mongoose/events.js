const Events = require("../../api/v1/events/model");
const { BadRequest, NotFound } = require("../../errors");
const { checkingCategories } = require("./categories");
const { checkingImages } = require("./images");
const { checkingTalents } = require("./talents");

const getAllEvents = async (req) => {
  const { keyword, category, talent } = req.query;

  let condition = {};

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: "i" } };
  }

  if (category) {
    condition = { ...condition, category: category };
  }

  if (talent) {
    condition = { ...condition, talent: talent };
  }

  const result = await Events.find(condition)
    .populate({
      path: "image",
      select: "_id name",
    })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "_id name" },
    });

  return result;
};

const createEvents = async (req) => {
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  await checkingImages(image);
  await checkingCategories(category);
  await checkingTalents(talent);

  const check = await Events.findOne({ title });

  if (check) throw new BadRequest("Judul acara sudah ada");

  const result = await Events.create({
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  });

  return result;
};

const getOneEvents = async (req) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: id })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: {
        path: "image",
        select: "_id name",
      },
    });

  if (!result) throw new NotFound(`Tidak ada acara dengan id : ${id}`);
  return result;
};

const updateEvents = async (req) => {
  const { id } = req.params;
  const { 
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent
  } = req.body

  await checkingImages(image);
  await checkingCategories(category);
  await checkingTalents(talent);

  const checkEvents = await Events.findOne({ _id: id });
  if (!checkEvents) throw new NotFound(`Tidak ada acara dengan id : ${id}`);

  const check = await Events.findOne({ title, _id: {$ne: id}});

  if(check) throw new BadRequest("Judul acara sudah ada");

  const result = await Events.findOneAndUpdate(
    { _id: id },
    {
      title,
      date,
      about,
      tagline,
      venueName,
      keyPoint,
      statusEvent,
      tickets,
      image,
      category,
      talent
    },
    { new: true, runValidators: true }
  );

  return result;
}

const deleteEvents = async (req) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: id });
  if (!result) throw new NotFound(`Tidak ada acara dengan id : ${id}`);
  await Events.deleteOne({ _id: id });
  return result
}

module.exports = {
  getAllEvents,
  createEvents,
  getOneEvents,
  updateEvents,
  deleteEvents
};
