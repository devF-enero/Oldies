const { SchemaDirectiveVisitor } = require ('apollo-server');
const { defaultFieldResolver } = require ('graphql');

class AuthDirective extends SchemaDirectiveVisitor {

    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field;    
        field.resolve = async function(...args){
            const [,,context] = args;
            if(context.user) {
                return await resolve.apply(this,args) 
                // this refers to the class we are in (AuthDirective) so we know 'apply' (from graphql) knows 
                // what context (what directive) we are calling it from
            } else {
                throw new Error('You must be authenticated')
            }
        }
    }
}

module.exports = AuthDirective;