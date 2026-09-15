const connectDB = require("./config/Database");

const Shift = require("./models/Shift");

const seedShifts = async () => {

  try {

    // Connect to database

    await connectDB();

    // Remove old shifts

    await Shift.deleteMany({});

    // Create default shifts

    await Shift.insertMany([

      {

        name: "Morning",

        startHour: 8,

        startMinute: 0,

        graceMinutes: 30,

      },

      {

        name: "Afternoon",

        startHour: 14,

        startMinute: 0,

        graceMinutes: 30,

      },

      {

        name: "Evening",

        startHour: 18,

        startMinute: 0,

        graceMinutes: 30,

      },

    ]);

    console.log("✅ Shift settings created successfully.");

    process.exit(0);

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

};

seedShifts();