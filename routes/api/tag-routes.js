const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  try {
    console.log("route accessed");
    const tagData = await Tag.findAll({
      include: [
        {
          model: Product,
          through: {
            model: ProductTag,
          },
        },
      ],
    });
    console.log("route processed");
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          through: {
            model: ProductTag,
          },
        },
      ],
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { tag_name, product_id } = req.body;
    const newTag = await Tag.create({
      tag_name: tag_name,
    });
    if (newTag && product_id) {
      await ProductTag.create({
        product_id: product_id,
        tag_id: newTag.id,
      });
    }
    res.status(200).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      return res.json({ message: "Tag updated" });
    })
    .catch((error) => {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the tag." });
    });
});

router.delete("/:id", async (req, res) => {
  try {
    await ProductTag.destroy({
      where: {
        tag_id: req.params.id,
      },
    });
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json({ message: "No Tag found with that id!" });
      return;
    }

    res.status(200).json({ message: "Tag successfully deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
