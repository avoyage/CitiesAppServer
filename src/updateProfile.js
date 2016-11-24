import {serialize} from './utils';
import fetchProfile from './fetchProfile';

const updateProfile = (connection, username, body) => {
  return new Promise(resolve => {
    const query = `UPDATE user SET ${serialize(body)} WHERE username='${username}';`;
    connection.query(query, (err) => {
      if (!err) {
        fetchProfile(connection, username).then(profile => {
          resolve(profile);
        });
      }
    });
  });
};

export default updateProfile;