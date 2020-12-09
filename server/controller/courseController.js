const Course = require('../models/courseModel')

exports.get_all = async (req, res) => {
    try {
        course = await Course.find();
        res.status(200).json({
            status: true,
            course,
        })
    } catch (err) {
        res.status(404).json({
            status: true,
            err,
        })
    }
}

exports.create_course = async (req, res) => {
    try {
        var course = await Course.findOne({ _id: req.body._id })
        if (course) {
            res.status(200).json({
                message: "course already exists"
            })
        } else {
            Course.create(req.body)
            // const uu = await new User(req.body).save()
            res.status(200).json({
                message: "success"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(404).json({ status: false, message: err });
    }
}

// 传id删除
exports.del_course = async (req, res) => {
    try {
        await Course.deleteOne({ _id: req.body._id })
        res.status(200).json({
            status: true,
            message: "success"
        })
    } catch (err) {
        console.log(err)
        res.status(404).json({ status: false, message: err })
    }
}

// 传id修改数据req(_id,想修改的数据)
exports.update_course = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.body._id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            message: 'success'
        })
    } catch (err) {
        res.status(404).json({
            err
        })
    }
}

//通过id获取数据
exports.getcourse = async (req, res) => {
    try {
        console.log(req)
        const course = await Course.findById(req.query.id);
        if (course) {
            res.status(200).json({
                course,
            })
        } else {
            res.status(404).json({
                message: 'not found',
            })
        }
    } catch (err) {
        res.status(409).json({
            err
        })
    }
}

// new： bool - 默认为false。返回修改后的数据。
// 　　upsert： bool - 默认为false。如果不存在则创建记录。
// 　　runValidators： 如果值为true，执行Validation验证。
// 　　setDefaultsOnInsert： 如果upsert选项为true，在新建时插入文档定义的默认值。
// 　　sort： 如果有多个查询条件，按顺序进行查询更新。
// 　　select： 设置数据的返回。