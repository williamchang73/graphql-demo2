import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';


const Conn = new Sequelize(
    'diamond-demo',
    'postgres',
    'postgres',
    {
        dialect: 'postgres',
        host: 'localhost'
    }
);

//member
const Member = Conn.define('member',{
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    avatar : {
        type : Sequelize.STRING,
        allowNull : false
    },
    wtp : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
});

//device
const Device = Conn.define('device',{
    type : {
        type : Sequelize.INTEGER
    },
    ip : {
        type : Sequelize.STRING,
        allowNull : false
    },
    isOnline :{
        type : Sequelize.BOOLEAN,
        allowNull : false
    },
    brand : {
        type : Sequelize.STRING
    },
    model : {
        type : Sequelize.STRING
    }
});

Member.hasMany(Device);
Device.belongsTo(Member);


// generate some data
// add some information
Conn.sync({ force:true }).then(()=> {
    _.times(10, ()=>{
       return Member.create({
           name: Faker.name.firstName(),
           avatar: Faker.image.imageUrl(),
           wtp: Faker.random.number(2)
       }).then(
           member=> {
               return member.createDevice({
                   ip: Faker.internet.ip(),
                   type: Faker.random.number(10),
                   isOnline: true,
                   brand: Faker.name.firstName(),
                   model: Faker.name.lastName()
               });
           }
       );
    });
});



export default Conn;


