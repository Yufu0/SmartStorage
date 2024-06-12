db = db.getSiblingDB('smartstorage');

db.createCollection('users');


filter = { username: 'ok' };

update = {
    $setOnInsert: {
        username: 'ok',
        password: '$2y$10$px3i3EKZlvLxL5/9BN7J0.wbkRzSTxKkgqRKHpGD2ffD8weKqFyia'
    }
};

const options = { upsert: true };

db.users.updateOne(filter, update, options);