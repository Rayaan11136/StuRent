import { motion } from "framer-motion";
import { km } from "../utils/formatters.js";

export default function NearbyCard({ place, index = 0 }) {
  return (
    <motion.article
      className="nearby-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <h3>{place.name}</h3>
      <p className="muted" style={{ margin: "0 0 6px" }}>
        {km(place.distance)}
      </p>
      <p style={{ margin: 0, fontSize: 14 }}>{place.detail}</p>
    </motion.article>
  );
}
