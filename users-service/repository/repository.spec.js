import repository from './repositiry';
import config from './config/config';

repository.connect(config.db).then((repo) => {
  repo.getUsers().then(users) => {
    console.log(users);
  });
  repo.getUserByEmail('homer@thesimpsons.com').then((user) => {
    console.log(user);
  })
  //  ...when you are done...
  repo.disconnect();
});
