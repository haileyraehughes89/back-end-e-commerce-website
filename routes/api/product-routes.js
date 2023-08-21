const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: {
            model: ProductTag,
          },
        },
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: {
            model: ProductTag,
          },
        },
      ],
    });

    if (!productData) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const productData = await Product.create(req.body);
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      return res.json({ message: "Product updated" });
    })
    .catch((error) => {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the product." });
    });
});

router.delete("/:id", async (req, res) => {
  try {
    await ProductTag.destroy({
      where: {
        product_id: req.params.id,
      },
    });
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productData) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    res.status(200).json({ message: "product destroyed" });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
