const getFileExtension = (filename) => {
  const regex = /.+\.(.+)/;
  return regex.exec(filename)?.[1] ? regex.exec(filename)?.[1] : "jpg";
};

module.exports = { getFileExtension };
