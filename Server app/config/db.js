var credentials={
	host     : 'localhost',
  user     : 'simple-cookingdbadmin',
  password : 'simple-cookingdbadmin626',
  database : 'simple-cookingdb'

});

var startupQueries=[];
startupQueries.push("CREATE TABLE IF NOT EXISTS `dishes` (
  `dish_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `recipe` text NOT NULL,
  `picture` varchar(250) DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  PRIMARY KEY (`dish_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;");

startupQueries.push("CREATE TABLE IF NOT EXISTS `dishes` (
  `dish_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `recipe` text NOT NULL,
  `picture` varchar(250) DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  PRIMARY KEY (`dish_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;");

startupQueries.push("CREATE TABLE IF NOT EXISTS `fridges` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;");

startupQueries.push("CREATE TABLE IF NOT EXISTS `fridge_to_ingredient` (
  `fridge_id` int(10) UNSIGNED NOT NULL,
  `ingredient_id` int(10) UNSIGNED NOT NULL,
  UNIQUE KEY `fridge_id` (`fridge_id`,`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;");

startupQueries.push("CREATE TABLE IF NOT EXISTS `fridge_to_user` (
  `fridge_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  UNIQUE KEY `fridge_id` (`fridge_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;");

startupQueries.push("CREATE TABLE IF NOT EXISTS `ingredients` (
  `ingredient_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ingredient_name` varchar(50) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;");

startupQueries.push("CREATE TABLE IF NOT EXISTS `ingredient_to_dish` (
  `ingredient_id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  PRIMARY KEY (`ingredient_id`,`dish_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;");

startupQueries.push("CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(60) NOT NULL,
  `google_id` varchar(100) NOT NULL,
  `picture` varchar(250) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `google_refresh_token` varchar(50) NOT NULL,
  `refresh_token` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `google_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;");

module.exports = {
  credentials:credentials,
  startupQueries:startupQueries
};
