const feed = (connection) => {
  return new Promise(resolve => {
    const feed = [{
      id: '1',
      text: 'Hello, City!',
      image: 'https://scontent-frt3-1.cdninstagram.com/t51.2885-15/e35/14736281_211360869294420_765623301136449536_n.jpg',
      author: {
        fullName: 'Pierre',
        username: 'pierre',
        image: 'https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/p320x320/1913867_1133637809981762_4149238391283925419_n.jpg?oh=403dd0706a42d1895aad1bcc84e44cdd&oe=58963126'
      },
      created: Date.now()
    }];

    resolve(feed);
  });
};

export default feed;