const mongoose = require("mongoose");
const {nanoid} = require("nanoid");
const config = require("./config");
const User = require("./models/User");
const Group = require("./models/Group");

mongoose.connect(config.db.url + "/" + config.db.name, {useNewUrlParser: true});
const db = mongoose.connection;

db.once("open", async () => {
  try {
    await db.dropCollection("users");
    await db.dropCollection("groups");
  } catch (e) {
    console.log("Collection were not presented!");
  }

  const [user1, user2, user3, user4, user5, user6, user7, user8] = await User.create(
    {
      email: "asd@asd.asd",
      password: "123",
      token: nanoid(),
      firstName: "Roger",
      lastName: "Waters",
      groups: [],
      posts: [],
      friends: [],
      gender: "male",
      relationships: "single",
      status: "Please act responsibly when commenting and know that this page is open to people of all ages.",
      city: "Great Bookham",
      birthDate: "6 september 1943",
      image: "Waters.jpeg"
    }, {
      email: "qwe@qwe.qwe",
      password: "123",
      token: nanoid(),
      firstName: "David",
      lastName: "Gilmor",
      groups: [],
      posts: [{
        dateTime: new Date(),
        text: "With my band",
        image: "pfband1.jpeg"
      }, {
        dateTime: new Date(),
        text: "Our new album",
        image: "pfalbum1.jpeg"
      }],
      friends: [],
      gender: "male",
      relationships: "married",
      status: "My new song, 'Yes, I Have Ghosts' - featuring vocals and harp from Romany Gilmour - is available to download & stream everywhere now.",
      city: "Cambridge",
      birthDate: "6 march 1946",
      image: "Gilmor.jpeg"
    }, {
      email: "zxc@zxc.zxc",
      password: "123",
      token: nanoid(),
      firstName: "Nick",
      lastName: "Mason",
      groups: [],
      posts: [],
      friends: [],
      gender: "male",
      relationships: "married",
      status: "",
      city: "Birmingham",
      birthDate: "27 january 1944",
      image: "Mason.jpeg"
    }, {
      email: "rty@rty.rty",
      password: "123",
      token: nanoid(),
      firstName: "Rick",
      lastName: "Wright",
      groups: [],
      posts: [],
      friends: [],
      gender: "male",
      status: "",
      relationships: "",
      city: "London",
      birthDate: "28 jule 1943",
      image: "Wright.jpeg"
    }, {
      email: "fgh@fgh.fgh",
      password: "123",
      token: nanoid(),
      firstName: "Jimmy",
      lastName: "Page",
      groups: [],
      posts: [],
      friends: [],
      gender: "male",
      relationships: "",
      status: "",
      city: "London",
      birthDate: "9 january 1944",
      image: "Page.jpeg"
    }, {
      email: "vbn@vbn.vbn",
      password: "123",
      token: nanoid(),
      firstName: "Robert",
      lastName: "Plant",
      groups: [],
      posts: [],
      friends: [],
      gender: "male",
      relationships: "",
      status: "",
      city: "West Bromwich",
      birthDate: "20 august 1948",
      image: "Plant.jpeg"
    }, {
      email: "qaz@qaz.qaz",
      password: "123",
      token: nanoid(),
      firstName: "John Paul",
      lastName: "Jones",
      groups: [],
      posts: [],
      friends: [],
      gender: "male",
      status: "",
      relationships: "",
      city: "Sidcup",
      birthDate: "3 january 1946",
      image: "Jones.jpeg"
    }, {
      email: "wsx@wsx.wsx",
      password: "123",
      token: nanoid(),
      firstName: "John",
      lastName: "Bonham",
      groups: [],
      posts: [],
      friends: [],
      gender: "male",
      relationships: "married",
      status: "",
      city: "Windsor",
      birthDate: "31 may 1948",
      image: "bonham.jpeg"
    });

  const [pinkFloyd, ledZeppelin] = await Group.create(
    {
      name: "Pink Floyd",
      description: "Please remember this page is open to fans of all ages and post responsibly.",
      creationDate: new Date(),
      admin: user1._id,
      image: "pflogo.jpeg",
      members: [],
      posts: [{
        dateTime: new Date(),
        text: "An overcast road, lined with beds, but do you know where the photograph used on this 1988 French concert poster was taken?",
        image: "pfpost1.jpeg"
      }, {
        dateTime: new Date(),
        text: "",
        image: "pfpost2.jpeg"
      }, {
        dateTime: new Date(),
        text: "The music to accompany this barbeque in 1967 is quite something. Which artists (other than Pink Floyd) would you have ensured you watched at this event?",
        image: "pfpost3.jpeg"
      },]
    }, {
      name: "Led Zeppelin",
      description: "Led Zeppelin official Vclontacte page.",
      creationDate: new Date(),
      admin: user5._id,
      image: "lzlogo.jpeg",
      members: [],
      posts: [{
        dateTime: new Date(),
        text: "Celebrate the 4th of July with 20% off all US Tour apparel. Now through July 6th.",
        image: "lzpost1.jpeg"
      }, {
        dateTime: new Date(),
        text: "The entire Mothership album, now on the official Led Zeppelin YouTube channel.",
        image: "lzpost2.jpeg"
      }, {
        dateTime: new Date(),
        text: "",
        image: "lzalbum3.jpeg"
      }, {
        dateTime: new Date(),
        text: "Jimmy Page - Led Zeppelin rehearsal, Shepperton 2007. Photograph by Ross Halfin.",
        image: "lzband3.jpeg"
      },]
    },
  );

  db.close();
});