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
    cve : {
        type : Sequelize.INTEGER
    },
    cveUrl : {
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

// Conn.sync({ force:false });
Conn.sync({ force:true }).then(()=>{
    _.times(10, ()=>{
        Device.create({
            name : Faker.name.firstName(),
            ip : Faker.internet.ip(),
            isOnline : true,
            type : Faker.random.number({min : 1, max : 10}),
            brand : Faker.name.firstName(),
            model : Faker.name.lastName()
        }).then(device => {
            Attack.create({
                name : Faker.name.title() + ' Attack',
                severity : Faker.random.number({min : 1, max : 5}),
                cve : Faker.random.number({min : 1, max : 7}),
                cveUrl : Faker.internet.url(),
                category : Faker.random.number({min : 1, max : 10})
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




export default Conn;


