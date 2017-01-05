const createPlace = (connection, placeId, mainText, secondaryText) => {
  return new Promise(resolve => {
    const query = `INSERT IGNORE INTO place (placeId, mainText, secondaryText) VALUES('${placeId}', '${mainText}', '${secondaryText}');`;
    connection.query(query, (err) => {
      if (!err) resolve({});
    });
  });
};

export default createPlace;