const mongoose = require("mongoose");
require("dotenv").config();

const Location = require("./src/locations/locations.model");

const filmingLocations = require("./lieux-de-tournage-a-paris.json");

function buildLocation(filmingLocation) {
  return {
    filmType: filmingLocation.fields.type_tournage,
    filmProducerName: filmingLocation.fields.nom_producteur,
    endDate: filmingLocation.fields.date_fin,
    filmName: filmingLocation.fields.nom_tournage,
    district: filmingLocation.fields.ardt_lieu,
    sourceLocationId: filmingLocation.fields.id_lieu,
    filmDirectorName: filmingLocation.fields.nom_realisateur,
    address: filmingLocation.fields.adresse_lieu,
    startDate: filmingLocation.fields.date_debut,
    year: filmingLocation.fields.annee_tournage,
    geolocation: filmingLocation.fields.geo_shape,
  };
}

async function importBulkFilmingLocations() {
  const locationsArray = filmingLocations.map((filmingLocation) =>
    buildLocation(filmingLocation)
  );
  await Location.insertMany(locationsArray);
}
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Import script connected to database, starting import.");
  await importBulkFilmingLocations();
  console.log("Finished importing.");
}

main();
