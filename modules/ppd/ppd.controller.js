const express = require("express");
const csv = require("csvtojson");
const Wilayah = require("./wilayah.model");
const Zonasi = require("./zona.model");
const sekolahCsvToJson = async () => {
  const json = await csv().fromFile("./datasekolah.csv");
  return json;
};
const zonaCsvToJson = async () => {
  const json = await csv().fromFile("./datazonasi.csv");
  let data = {};
  let curSchool = "";
  for (let i = 0; i < json.length; i++) {
    if (json[i].nama !== "") {
      curSchool = json[i].nama.toUpperCase().replace(/\s+/g, " ");
      data[curSchool] = {
        no: json[i].no,
      };
      if (json[i].zona1.length > 1) {
        data[curSchool].zona1 = !data[curSchool].zona1
          ? json[i].zona1.toUpperCase()
          : `${data[json[i].nama].zona1},${json[i].zona1.toUpperCase()}`;
      }
      if (json[i].zona2.length > 1) {
        data[curSchool].zona2 = !data[curSchool].zona2
          ? json[i].zona2.toUpperCase()
          : `${data[json[i].nama].zona2},${json[i].zona2.toUpperCase()}`;
      }
      if (json[i].zona3.length > 1) {
        data[curSchool].zona3 = !data[curSchool].zona3
          ? json[i].zona3.toUpperCase()
          : `${data[json[i].nama].zona3},${json[i].zona3.toUpperCase()}`;
      }
      if (json[i].zona4.length > 1) {
        data[curSchool].zona4 = !data[curSchool].zona4
          ? json[i].zona4.toUpperCase()
          : `${data[json[i].nama].zona4},${json[i].zona4.toUpperCase()}`;
      }
    } else {
      data[curSchool].zona1 =
        json[i].zona1.length > 0
          ? `${data[curSchool].zona1},${json[i].zona1.toUpperCase()}`
          : data[curSchool].zona1;
      data[curSchool].zona2 =
        json[i].zona2.length > 0
          ? `${data[curSchool].zona2},${json[i].zona2.toUpperCase()}`
          : data[curSchool].zona2;
      data[curSchool].zona3 =
        json[i].zona3.length > 0
          ? `${data[curSchool].zona3},${json[i].zona3.toUpperCase()}`
          : data[curSchool].zona3;
      data[curSchool].zona4 =
        json[i].zona4.length > 0
          ? `${data[curSchool].zona4},${json[i].zona4.toUpperCase()}`
          : data[curSchool].zona4;
    }
  }
  return data;
};

const ppdController = express.Router();
ppdController.get("/insertzonamentah", async (req, res) => {
  const data = await zonaCsvToJson();
  return res.json(data);
});

ppdController.get("/check-wilayah", async (req, res) => {
  const unknown = [];
  const data = await zonaCsvToJson();
  keys = Object.keys(data);
  await Promise.all(
    keys.map(async (key) => {
      const kelurahanList = [
        ...data[key].zona1.split(","),
        ...data[key].zona2.split(","),
      ];
      await Promise.all(
        kelurahanList.map(async (item) => {
          const wilayah = await Wilayah.findAll({ where: { desa: item } });
          if (wilayah.length == 0) {
            unknown.push({
              no: data[key].no,
              wilayah: item,
              type: "kelurahan",
            });
          }
        })
      );
      const kecamatanList = [...data[key].zona3.split(",")];
      if (data[key].zona4) {
        kecamatanList.push(...data[key].zona4.split(","));
      }
      await Promise.all(
        kecamatanList.map(async (item) => {
          const wilayah = await Wilayah.findAll({ where: { kecamatan: item } });
          if (wilayah.length == 0) {
            unknown.push({
              no: data[key].no,
              wilayah: item,
              type: "kecamatan",
            });
          }
        })
      );
    })
  );
  return res.json(unknown);
});
ppdController.get("/sekolah", async (req, res) => {
  const data = await sekolahCsvToJson();
  res.json(data);
});
ppdController.get("/check-sekolah", async (req, res) => {
  const sekolah = await sekolahCsvToJson();
  const zona = await zonaCsvToJson();
  const confirmedSchoolList = Object.keys(zona);
  const unconfirmedSchoolList = sekolah.map((item) => item.schoolname);
  let unknownSchool = [];
  await Promise.all(
    confirmedSchoolList.map((item) => {
      if (!unconfirmedSchoolList.includes(item)) {
        unknownSchool.push(item);
      }
    })
  );
  res.json(unknownSchool);
});
ppdController.get("/kelurahan-list", async (req, res) => {
  const zona = await zonaCsvToJson();
  const confirmedSchoolList = Object.keys(zona);
  const kelurahanList = [];
  confirmedSchoolList.map((key) => {
    kelurahanList.push(...zona[key].zona1.split(","));
    kelurahanList.push(...zona[key].zona2.split(","));
  });
  const data = kelurahanList.filter(
    (item, index) => kelurahanList.indexOf(item) == index
  );
  res.json(data.length);
});
ppdController.get("/insert-sekolah", async (req, res) => {
  const dataZona = await zonaCsvToJson();
  const allSchool = await sekolahCsvToJson();
  const confirmedSchoolList = Object.keys(dataZona);
  const schoolDataList = [];
  await Promise.all(
    confirmedSchoolList.map(async (schoolname, index) => {
      let schooldata = await allSchool.find(
        (item) => item.schoolname == schoolname
      );
      const data = { ...schooldata };
      data.idsc = 300 + index + 1;
      schoolDataList.push(data);
      // console.log(data);
    })
  );
  res.json(schoolDataList);
});
ppdController.get("/insert-zonasi", async (req, res) => {
  const data = [];
  const zona = await zonaCsvToJson();
  const schoolNameList = Object.keys(zona);
  await Promise.all(
    schoolNameList.map(async (school) => {
      const kecamatan = "";
      const zona1 = zona[school].zona1.split(",");
      const zona2 = zona[school].zona2.split(",");
      const kelurahanList = [...zona1, ...zona2];
      const zona3 = zona[school].zona3.split(",");
      // zona4 = zona[school].zona4.split(",");
      const idsc = "";
      await Promise.all(
        kelurahanList.map((kelurahan) => {
          data.push({
            kecamatan,
            idsc,
            school,
            kelurahan,
          });
        })
      );
    })
  );
  res.json(data);
});
module.exports = ppdController;
