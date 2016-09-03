import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

import Db from './db';
import RP from 'request-promise';


const Attack = new GraphQLObjectType({
    name : 'Attack',
    description : 'attack information',
    fields: () => {
        return{
            name : {
                type : GraphQLString,
                resolve (attack) {
                    return attack.name;
                }
            },
            severity : {
                type : GraphQLInt,
                resolve (attack) {
                    return attack.severity;
                }
            },
            cve : {
                type : GraphQLInt,
                resolve (attack) {
                    return attack.cve;
                } 
            },
            cveUrl : {
                type : GraphQLString,
                resolve (attack) {
                    return attack.cveUrl;
                } 
            },
            category : {
                type : GraphQLInt,
                resolve (attack) {
                    return attack.category;
                }
            },
            information : {
                type : GraphQLString,
                resolve (attack){
                    //get from document server
                    var url = 'http://swapi.co/api/films/'+attack.cve+'/';
                    return new RP(url)
                    .then(function (body) {
                        // Process html...
                        var result = JSON.parse(body);
                        return result.title;
                    })
                    .catch(function (err) {
                        // Crawling failed...
                        console.debug(err);
                        return '';
                    });
                }
            }
        };
    }
});

const Device = new GraphQLObjectType({
  name: 'Device',
  description: 'This represents a Device',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (device) {
          return device.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve (device) {
          return device.name;
        }
      },
      ip: {
        type: GraphQLString,
        resolve (device) {
          return device.ip;
        }
      },
      isOnline: {
        type: GraphQLBoolean,
        resolve (device) {
          return device.isOnline;
        }
      },
      type: {
        type: GraphQLInt,
        resolve (device) {
          return device.type;
        }
      },
      brand: {
        type: GraphQLString,
        resolve (device) {
          return device.brand;
        }
      },
      model: {
        type: GraphQLString,
        resolve (device) {
          return device.model;
        }
      },
      event: {
          type: new GraphQLList(Event),
          resolve (device){
              return Db.models.event.findAll({ where: {deviceId : device.id} });
          }
      }
    };
  }
});

const Event = new GraphQLObjectType({
    name: 'Event',
    description : 'device got attack',
    fields: () => {
        return {
            device : {
                type : new GraphQLList(Device),
                resolve(event){
                    return Db.models.device.findAll({ where: {id : event.deviceId} });
                }
            },
            attack : {
                type : new GraphQLList(Attack),
                resolve(event){
                    return Db.models.attack.findAll({ where: {id : event.attackId} });
                }
            },
            action: {
                type : GraphQLInt,
                resolve (event) {
                   return event.action;
                }
            }
        };
    }
});


const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
        event: {
            type : new GraphQLList(Event),
            args: {
                deviceId : {
                    type : GraphQLInt
                }
            },
            resolve (root, args) {
                return Db.models.event.findAll({ where: args });
            }
        },
        device:{
            type : new GraphQLList(Device),
            args:{
                id : {
                    type : GraphQLInt
                }
            },
            resolve (root, args){
                return Db.models.device.findAll({ where: args });
            }
        }
    };
  }
});


const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
