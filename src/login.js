import bcrypt from 'bcrypt';

const login = (connection, username, password) => {
  return new Promise(resolve => {
    const query = `SELECT *, CONVERT(hash, CHAR(60)) as hash FROM user WHERE username='${username}'`;
    connection.query(query, (err, rows) => {
      if (!err && rows.length && bcrypt.compareSync(password, rows[0].hash)) {
        resolve({});
        // resolve({
        //   username: rows[0].username,
        //   firstName: rows[0].firstName,
        //   lastName: rows[0].lastName,
        //   phone: rows[0].phone,
        //   bio: rows[0].bio,
        // });
      }
    });
  });
};

export default login;