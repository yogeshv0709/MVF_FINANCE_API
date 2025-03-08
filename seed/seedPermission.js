const mongoose = require("mongoose");
const RoleModel = require("../src/models/Role.model");
const Permission = require("../src/models/Permission.model"); // Import Permission Model

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Define permissions for Admin (all true)
    const adminPermissions = [
      "Product",
      "Staff",
      "Inventory",
      "Frenchise",
      "User",
      "Order",
      "Purchase-History",
    ].map((module) => ({
      Module: module,
      Create: true,
      Read: true,
      Update: true,
      Delete: true,
    }));

    // Define permissions for Franchise
    const franchisePermissions = [
      {
        Module: "Product",
        Create: false,
        Read: true,
        Update: false,
        Delete: false,
      },
      {
        Module: "Staff",
        Create: false,
        Read: false,
        Update: false,
        Delete: false,
      },
      {
        Module: "Inventory",
        Create: false,
        Read: true,
        Update: false,
        Delete: false,
      },
      {
        Module: "Frenchise",
        Create: false,
        Read: false,
        Update: false,
        Delete: false,
      },
      {
        Module: "User",
        Create: false,
        Read: false,
        Update: false,
        Delete: false,
      },
      { Module: "Order", Create: true, Read: true, Update: true, Delete: true },
      {
        Module: "Purchase-History",
        Create: true,
        Read: true,
        Update: true,
        Delete: true,
      },
    ];

    // Insert Permissions into DB
    const adminPermissionDocs = await Permission.insertMany(adminPermissions);
    const franchisePermissionDocs = await Permission.insertMany(
      franchisePermissions
    );

    // Insert Roles into DB
    await RoleModel.create([
      {
        roleId: "R1000",
        name: "Admin",
        isPermission: adminPermissionDocs.map((p) => p._id), // Store permission IDs
      },
      {
        roleId: "R1001",
        name: "Franchise",
        isPermission: franchisePermissionDocs.map((p) => p._id),
      },
    ]);

    console.log("Roles and permissions added successfully!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error inserting roles and permissions:", error);
  });
