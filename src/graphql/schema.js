import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'QRoot',
    fields: {
      name:{
        type: GraphQLInt,
        resolve(){
          return 1;
        },
      },
    },
  }),
});
