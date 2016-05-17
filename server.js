import Express from 'express';
import path from 'path';
import expressGraphql from 'express-graphql';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';

let app = Express();
let port = process.env.PORT ? process.env.PORT  : 8080;


app.use('/', Express.static('./public'));
app.use('/graphql', expressGraphql( request => ( {
  schema: new GraphQLSchema({
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
  }),
} ) ));

app.listen( port, () => {
  console.log( 'listening on port ' + port );
});
