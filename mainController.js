const MainMethods = require("./mainMethods.js");
const SQLQueries = require("./SQLQueries.js");


class Controller {
    async getFamily (req, res) {
        try {
            const members = await MainMethods.getFamily();
            return res.json({
                members
            })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

    async getMember (req, res) {
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({
                    message: "Id is required"
                })
            }
            const exists = await SQLQueries.getMember(id).then(member => !!member.rows.length)
            if (!exists) {
                return res.status(400).json({
                    message: `Member with id ${id} doesn't exist`
                })
            }
            const member = await MainMethods.getMember(id);
            return res.json(member);
        } catch (error) {
            return res.status(500).json(
                {
                    message: error.message
                }
            )
        }
    }
    async createMember (req, res) {
        try {
            const { first_name, last_name, age, relations, gender } = req.body;
            if (!first_name) {
                return res.status(400).json({
                    message: "first_name is required"
                })
            }

            if (!last_name) {
                return res.status(400).json({
                    message: "last_name is required"
                })
            }

            if (!age || !Number.isInteger(age)) {
                return res.status(400).json({
                    message: "age is required and has to be an integer"
                })
            }

            if (gender !== "Male" && gender !== "Female") {
                return res.status(400).json({
                    message: "gender is required and can be 'Male' or 'Female'"
                })
            }
            const member = await MainMethods.createMember(
                first_name,
                last_name,
                age,
                relations,
                gender
            )
                return res.json(member);
        } catch (error) {
            return res.status(500).json(
                {
                    message: error.message
                }
            )
        }
    }

    async deleteMember (req, res) {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({
                    message: "Id is required"
                })
            }
            const exists = await SQLQueries.getMember(id).then(member => !!member.rows.length)
            if (!exists) {
                return res.status(400).json({
                    message: `Member with id ${id} doesn't exist`
                })
            }
            const deletedMember = await MainMethods.deleteMember(id);
            if (deletedMember) {
                return res.json({
                    message: `Member with id ${id} was deleted`
                })
            }
            return res.status(500).json({
                message: `Something went wrong`
            })
        } catch (error) {
            return res.status(500).json(
                {
                    message: error.message
                }
            )
        }
    }

    async updateMember (req, res) {
        try {
            const { id } = req.query;
            const { first_name, last_name, age, relations } = req.body;
            if (!id) {
                return res.status(400).json({
                    message: "Id is required"
                })
            }
            const exists = await SQLQueries.getMember(id).then(member => !!member.rows.length)
            if (!exists) {
                return res.status(400).json({
                    message: `Member with id ${id} doesn't exist`
                })
            }
            if (!(first_name || last_name || age || relations)) {
                return res.status(400).json({
                    message: "One of these parameters have to be in the body: first_name, last_name, age, relations, gender"
                })
            }

            const changedMember = await MainMethods.updateMember(id, first_name, last_name, age, relations);
            if (changedMember) {
                return res.json(changedMember);
            }

            return res.status(500).json({
                message: `Something went wrong`
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json(
                {
                    message: error.message
                }
            )
        }
    }
}

module.exports = new Controller();