const authorModel = require("../Models/authorModel")
const blogModel = require("../Models/blogModel")

const { isValidString, isVlaidName, isValidId } = require('../validator/validator')


//2.
const createBlog = async function (req, res) {
    try {
        const data = req.body
        const { title, body, authorId, category } = data
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "please enter some data in req body" })

        if (!title) return res.status(400).send({ msg: "  title is required" })
        if (!isValidString(title) && !isVlaidName(title)) return res.status(400).send({ status: false, message: "please enter valid title" })

        if (!body) return res.status(400).send({ msg: "  body is required" })
        if (!isValidString(body)) return res.status(400).send({ status: false, message: "please enter valid body" })

        if (!authorId) return res.status(400).send({ msg: "authorid is required" })
        if (!isValidId(authorId)) return res.status(400).send({ status: false, message: "please enter valid authorid" })
        const authId = await authorModel.findById({ _id: authorId })
        if (!authId) return res.status(404).send({ status: false, message: "this authoId is not exist in DB, so please enter valid authorId" })

        if (!category) return res.status(400).send({ msg: "category is required" })
        if (isValidString(category)) return res.status(400).send({ status: false, message: "please enter valid category" })

        const datablogging = await blogModel.create(data)
        res.status(201).send({ status: true, data: datablogging })

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



//3.
const getBlog = async function (req, res) {
    try {
        const { authorId, category, tags, subcategory } = req.query

        let obj1 = {
            isDeleted: false,
            isPublished: true,
        }

        //Adding content to above object for DB call
        if (authorId) {
            obj1.authorId = authorId
            if (!isValidId(authorId)) return req.status(400).send({ status: false, message: "please enter valid authorId" })
        }
        if (category) {
            obj1.category = category
            if (!isValidString(category)) return res.status(400).send({ status: false, message: "please enter valid category" })
        }
        if (tags) {
            obj1.tags = tags
            if (!isValidString(tags)) return res.status(400).send({ status: false, message: "please enter valid tag" })
        }
        if (subcategory) {
            obj1.subcategory = subcategory
            if (isValidString(subcategory)) return res.status(400).send({ status: false, message: "please enter valid subcategory" })
        }

        const result = await blogModel.find(obj1)
        if (result.length === 0) return res.status(404).send({ status: false, message: "No data found" })
        res.status(200).send({ status: true, data: result })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//4.
const updateBlogs = async function (req, res) {
    try {
        const blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ status: false, message: "please enter blogId in path params" })
        if (isValidId(blogId)) return res.status(400).send({ status: false, message: "please enter valid blogId" })

        const { title, body, tags, subcategory } = req.body

        if (title) {
            if (isValidString(title)) return res.status(400).send({ status: false, message: "please enter valid title" })
        }
        if (body) {
            if (!isValidString(body)) return res.status(400).send({ status: false, message: "please enter valid body" })
        }
        if (tags) {
            if (!isValidString(tags)) return res.status(400).send({ status: false, message: "please enter valid tags" })
        }
        if (subcategory) {
            if (!isValidString(subcategory)) return res.status(400).send({ status: false, message: "please enter valid subcategory" })
        }
        const updateEntry = await blogModel.findByIdAndUpdate({ _id: blogId, isDeleted: false, isPublished: false },
            { $set: { title: title, body: body, isPublished: true, publishedAt: new Date() }, $push: { tags: tags, subcategory: subcategory } },
            { new: true })

        if (!updateEntry) return res.status(404).send({ status: false, message: "blog not found" })

        res.status(200).send({ status: true, data: updateEntry })

    } catch (error) {
        res.status(500).send({status: false, message: error.message })
    }
}


//5.
const deleteBlogs = async function (req, res) {
    try {
        const blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ status: false, message: "please enter blogId in path params" })
        if (isValidId(blogId)) return res.status(400).send({ status: false, message: "please enter valid blogId" })


        const findData = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() }})

        if (!findData) {
            return res.status(404).send({status: false, message: "document is not found" })
        }
        res.status(200).send({status: true, message: "Document is deleted" })

    }catch (error) {
        res.status(500).send({status: false, message: error.message })
    }
}


//6.
const deleteByQuery = async function (req, res) {
    try {
        const obj1 = {
            isDeleted: false,
            isPublished: false,
        }
        const { category, authorId, tags, subcategory } = req.query

        if (category) {
            obj1.category = category;
            if (!isValidString(category)) return res.status(400).send({ status: false, message: "please enter valid category" })
        }

        if (authorId) {
            obj1.authorId = authorId
            if (!isValidId(authorId)) return res.status(400).send({ status: false, message: "please enter valid authorId" })
        }
        if (tags) {
            obj1.tags = tags
            if (!isValidString(tags)) return res.status(400).send({ status: false, message: "please enter valid tag" })
        }
        if (subcategory) {
            obj1.subcategory = subcategory
            if (!isValidString(subcategory)) return res.status(400).send({ status: false, message: "please enter valid subcategory" })
        }


        const findAndDeleteData = await blogModel.findOneAndUpdate(obj1,
            { $set: { isDeleted: true, deletedAt: new Date() }})

        if (!findAndDeleteData) {
            return res.status(404).send({status:false, message: "documnet is not found " })
        }
        res.status(200).send({status:true, message: "document is Deleted" })

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlogs = updateBlogs
module.exports.deleteBlogs = deleteBlogs
module.exports.deleteByQuery = deleteByQuery

