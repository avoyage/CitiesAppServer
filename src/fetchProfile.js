const fetchProfile = (connection, username) => {
  return new Promise(resolve => {
    const query = `SELECT * FROM user WHERE username='${username}';`;
    connection.query(query, (err, rows) => {
      if (!err && rows.length) {
        resolve({
          username: rows[0].username,
          firstName: rows[0].firstName,
          lastName: rows[0].lastName,
          phone: rows[0].phone,
          placeId: rows[0].placeId,
          bio: rows[0].bio,
        });
      }
    });
  });
};

export default fetchProfile;