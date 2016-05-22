import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import transaction from '../db/transaction.js'

let TransactionResult = new GraphQLObjectType({
  name: 'TransactionResult',
  fields: {
    status: { type: GraphQLString },
    results: { type: new GraphQLList(GraphQLString) }
  }
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'QRoot',
    fields: {
      name:{
        type: TransactionResult,
        resolve(){
          return transaction( [ {
            qry: 'select * from users where id=$1',
            params: [ 4 ],
          } ]);
        },
      },
    },
  }),
});
