const User = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if(!profile){
            throw AuthenticationError;
        }
        
        const correctPassword = await user.isCorrectPassword(password);

        if(!correctPassword){
            throw AuthenticationError;
        }

        const token = signToken(user);
        return { token, user };
    },
    addUser: async (parent,args) => {
        const user = await User.create(args);
        const token = signToken(user);

        return{ token, user };
    },
    saveBook: async (parent, { input }, context) => {
        if(context.user){
            return User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input }},
                { new: true }
            );
        } 
        throw AuthenticationError;
    },
    removeBook: async (parent, { bookId }, context) => {
        if(context.user){
            return User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId }}},
                { new: true }
            );
        }
        throw AuthenticationError;
    },
  },
};

module.exports = resolvers;