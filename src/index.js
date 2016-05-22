import Express from 'express';
import path from 'path';
import expressGraphql from 'express-graphql';
import schema from './graphql/schema.js';

let app = Express();
let port = process.env.PORT ? process.env.PORT  : 8080;


app.use('/', Express.static('./public'));
app.use('/graphql', expressGraphql( request => ( {
  schema,
  graphiql: true,
} ) ));

app.listen( port, () => {
  console.log( 'listening on port ' + port );
});
