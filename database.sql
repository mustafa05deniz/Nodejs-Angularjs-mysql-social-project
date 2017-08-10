
create table users(
	id int Auto_increment primary key,
	username varchar(100),
	password varchar(100)
)



create table posts (
    id int Auto_increment primary key,
    text varchar(1000),
    userID int,
    likes int ,
    foreign key(userID) references users(id)
)


create table comments(
    id int Auto_increment primary key,
    text varchar(1000),
    userID int,
    postID int,
    foreign key(userID) references users(id),
    foreign key(postID) references posts(id)
)