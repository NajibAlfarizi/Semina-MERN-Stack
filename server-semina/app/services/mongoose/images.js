const Images = require("../../api/v1/images/model");

const generateUrlImages = async (req) => {
  const result = `uploads/${req.file.filename}`;

  return result;
};

const createImages = async (req) => {
  const result = await Images.create({
    name: req.file
      ? `uploads/${req.file.filename}`
      : `uploads/avatar/default.jpg`,
  });

  return result;
};

const checkingImages = async (id) => {
  const result = await Images.findOne({ _id: id });

  if (!result) throw new Error(`Tidak ada gambar dengan id : ${id}`);

  return result;
};

module.exports = {
  createImages,
  generateUrlImages,
  checkingImages,
};
