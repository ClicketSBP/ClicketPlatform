const fs = require('fs');

fs.createReadStream('./config/clicket.env')
  .pipe(fs.createWriteStream('.env'));