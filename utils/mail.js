const { db } = require('../utils/db')


async function sendMail (email) {
    //create an unique code in database
    const code = Math.floor(100000 + Math.random() * 900000)

    function addMinutes(date, minutes) {
        const dateCopy = new Date(date);
        dateCopy.setMinutes(date.getMinutes() + minutes);
      
        return dateCopy;
      }
      
      const date = new Date();
      
      const expires = addMinutes(date, 15);

    const verification = await db.verification.create({
        data: {
            email: email,
            code: code,
            expires: expires
        }

        
    })

    

    //send unique code to the user with email provided
}

async function verifyEmailCode ({email, code}) {
   
    const codeFound = await db.verification.findFirstOrThrow({
        where: {
            code: parseInt(code)
        }
    })

   if (codeFound === "NotFoundError: No User found error") {
        return false
   }

   await db.user.update({
    where: {
        email: email
    },
    data: {
        activated: true
    }
   })
   
   return true

}

module.exports = { sendMail, verifyEmailCode }