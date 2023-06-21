const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Product.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!productData) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router
  .post("/", async (req, res) => {
    Category.create(req.body).then(category);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const categoryTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          category_id: category.id,
          tag_id,
        };
      });
      return CategoryTag.bulkCreate(categoryTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(category);
  })
  .then((categoryIds) => res.status(200).json(categoryIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
// create a new category

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  }).then((category) => {
    if (req.body.tagIds && req.body.tagIds.length) {
      CategoryTag.findAll({
        where: { product_id: req.params.id },
      }).then((procategorys) => {
        // create filtered list of new tag_ids
        const categoryTagIds = categoryTags.map(({ tag_id }) => tag_id);
        const newCategoryTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              category_id: req.params.id,
              tag_id,
            };
          });

        // figure out which ones to remove
        const categoryTagsToRemove = categoryTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
        // run both actions
        return Promise.all([
          CategoryTag.destroy({ where: { id: categoryTagsToRemove } }),
          CategoryTag.bulkCreate(newCategoryTags),
        ]);
      });
    }

    return res.json(Category);
  });

  router.delete("/:id", (req, res) => {
    // delete a category by its `id` value
  });
});
module.exports = router;
