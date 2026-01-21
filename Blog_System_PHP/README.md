# Simple CMS

A simple Content Management System (CMS) built with PHP and MySQL.

## Features

- User authentication (login, register, logout)
- User roles (admin, user)
- Post management (create, read, update, delete)
- Category management
- Tag management
- Comment system
- Responsive design using Bootstrap 5
- Clean and modern UI

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- mod_rewrite enabled (for Apache)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/simple-cms.git
cd simple-cms
```

2. Create a MySQL database named `simple_cms`

3. Import the database schema:
```bash
mysql -u root -p simple_cms < database/schema.sql
```

4. Configure the database connection:
- Open `config/database.php`
- Update the database credentials:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'simple_cms');
```

5. Set up your web server:
- For Apache, ensure the `.htaccess` file is present in the root directory
- For Nginx, add the following to your server configuration:
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## Default Login

- Email: admin@example.com
- Password: password

## Directory Structure

```
simple-cms/
├── classes/           # PHP classes
│   ├── Post.php
│   ├── Category.php
│   ├── Tag.php
│   ├── User.php
│   └── Comment.php
├── config/           # Configuration files
│   └── database.php
├── database/         # Database files
│   └── schema.sql
├── templates/        # Template files
│   ├── header.php
│   ├── footer.php
│   ├── home.php
│   ├── post.php
│   ├── category.php
│   ├── tag.php
│   ├── login.php
│   ├── register.php
│   └── admin/
│       ├── dashboard.php
│       ├── edit_post.php
│       ├── edit_category.php
│       ├── edit_tag.php
│       └── edit_user.php
├── .htaccess        # Apache configuration
├── index.php        # Main application file
└── README.md        # This file
```

## Usage

1. Start by logging in with the default admin account
2. Create categories and tags
3. Create new posts and assign them to categories and tags
4. Manage users and their roles
5. Monitor and moderate comments

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any problems or have suggestions, please open an issue on GitHub. 