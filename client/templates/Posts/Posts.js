Posts = new Mongo.Collection('posts');

Session.setDefault('subreddit', 'all');
Session.setDefault('searching', false);

SUPPORTED_MEDIA_TYPES = ['jpg', 'png', 'gif'];

Tracker.autorun(function() {
    if (Session.get('subreddit')) {
        var searchHandle = Meteor.subscribe('subredditSearch', Session.get('subreddit'));
        Session.set('searching', ! searchHandle.ready());
    }
});

Template.body.events({
    'submit form': function(e, t) {
        e.preventDefault();

        var subreddit = t.$('input[type=text]').val();

        if (subreddit) {
            Session.set('subreddit', subreddit);
        }
    },

    'click .icon': function(e) {
        e.preventDefault();

        var post = Blaze.getData(e.target);
        var post_holder = $('.post[data-id=' + post.id + ']');
        var image = $('.post[data-id=' + post.id + ']').find('.image-preview');

        if (image.is(':visible')) {
            console.log('show');
            image.slideUp();
        } else {
            
            if (Meteor.call('checkSupportedTypes', post.url.substr(post.url.length - 3))) {
                image.prop('src', post.url).slideDown();
            } else {
                window.open(post.url, '_blank');
            }
        }
    }
});

Template.body.helpers({
    posts: function() {
        return Posts.find();
    },

    searching: function() {
        return Session.get('searching');
    }
});

Meteor.methods({
    checkSupportedTypes: function(url) {
        if (SUPPORTED_MEDIA_TYPES.indexOf(url) > -1) { return true; }
        return false;
    }
});