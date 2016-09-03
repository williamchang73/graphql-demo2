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

//device
const Device = Conn.define('device',{
    name : {
        type : Sequelize.STRING
    },
    ip : {
        type : Sequelize.STRING,
        allowNull : false
    },
    isOnline :{
        type : Sequelize.BOOLEAN,
        allowNull : false
    },
    type : {
        type : Sequelize.INTEGER
    },
    brand : {
        type : Sequelize.STRING
    },
    model : {
        type : Sequelize.STRING
    }
});


//attack
const Attack = Conn.define('attack',{
    name : {
        type : Sequelize.STRING,
        allowNull : false        
    },
    severity : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    vce : {
        type : Sequelize.STRING
    },
    category : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
});



const Event = Conn.define('event', {
    action : {
        type : Sequelize.INTEGER
    }
});



Device.belongsToMany(Attack, {through: 'event'});
Attack.belongsToMany(Device, {through: 'event'});

Conn.sync({ force:true }).then(()=>{
    _.times(10, ()=>{
        Device.create({
            name : Faker.name.firstName(),
            ip : Faker.internet.ip(),
            isOnline : true,
            type : Faker.random.number(10),
            brand : Faker.name.firstName(),
            model : Faker.name.lastName()
        }).then(device => {
            Attack.create({
                name : Faker.name.title() + ' Attack',
                severity : Faker.random.number(5),
                vce : Faker.internet.url(),
                category : Faker.random.number(10)
            }).then(
                attack => {
                    device.addAttack(attack,{
                        action : Faker.random.number(3)
                    });
                }
            );
        });
    });
});

// .then(()=> {
//     _.times(10, ()=>{
//        return Member.create({
//            name: Faker.name.firstName(),
//            avatar: Faker.image.imageUrl(),
//            wtp: Faker.random.number(2)
//        }).then(
//            member=> {
//                return member.createDevice({
//                    ip: Faker.internet.ip(),
//                    type: Faker.random.number(10),
//                    isOnline: true,
//                    brand: Faker.name.firstName(),
//                    model: Faker.name.lastName()
//                });
//            }
//        );
//     });
// });



export default Conn;


