import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mongoose from "mongoose";
import visitorRoute from "./routes/visitorRoute.js"
import complaintRoutes from "./routes/complaintRouter.js"
import maintenanceRoutes from "./routes/maintenanceRouter.js";
import noticeRoutes from "./routes/noticeRouter.js";
import parcelRoutes from "./routes/parcelRouter.js";
import parkingRoutes from "./routes/parkingRouter.js";
import serviceProviderRoutes from "./routes/serviceRouter.js";

dotenv.config();
connectDB();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Local MongoDB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));


const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);


app.use("/api/visitor", visitorRoute);

app.use("/api/complaints", complaintRoutes);

app.use("/api/maintenance", maintenanceRoutes);

app.use("/api/notices", noticeRoutes);

app.use("/api/parcels", parcelRoutes);

app.use("/api/parking", parkingRoutes);

app.use("/api/service-providers", serviceProviderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
