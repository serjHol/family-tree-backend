const db = require("./DB.js");

class SQLQueries {
    async getFamilyMembers () {
        return await db.query(
            `SELECT * FROM people`
        );
    }

    async getRelations () {
        return await db.query(
            `SELECT * FROM relation`
        );
    }

    async getRelationById (id) {
        return await db.query(
            `SELECT * FROM relation WHERE id = ${id}`
        );
    }

    async getMember (id) {
        return await db.query(
            `SELECT * FROM people WHERE id = ${id}`
        );
    }

    async getMemberRelations (id) {
        return await db.query(
            `SELECT * FROM relation WHERE id_1 = ${id} OR id_2 = ${id}`
        );
    }

    async getGenderById (id) {
        return await db.query(
            `SELECT * FROM gender WHERE id = ${id}`
        )
    }

    async getGenderId (gender) {
        return await db.query(
            `SELECT * FROM gender WHERE gender_value = '${gender}'`
        )
    }

    async getRelationTypeById (id) {
        return await db.query(
            `SELECT * FROM relation_type WHERE id = ${id}`
        );
    }

    async getRelationOrderById (id) {
        return await db.query(
            `SELECT * FROM relation_order WHERE id = ${id}`
        );
    }

    async createMember (first_name, last_name, age, genderId) {
        return await db.query(
            `INSERT INTO people (\
                first_name,\
                last_name,\
                gender_id,\
                age) values (\
                '${first_name}',\
                '${last_name}',\
                ${genderId},\
                ${age}\
                ) RETURNING *`
        )
    }

    async getRelationTypeIdByValue (type) {
        return await db.query(
            `SELECT * FROM relation_type WHERE type = '${type}'`
        );
    }

    async createRelation (id_1, id_2, relationTypeId) {
        return await db.query(
            `INSERT INTO relation (id_1, id_2, type_id) values (${id_1}, ${id_2}, ${relationTypeId})`
        );
    }

    async deleteAllMemberRelations (id) {
        return await db.query(
            `DELETE FROM relation WHERE id_1 = ${id} OR id_2 = ${id} RETURNING *`
        )
    }

    async deleteMember (id) {
        return await db.query(
            `DELETE FROM people WHERE id = ${id} RETURNING *`
        )
    }

    async updateMember (id, first_name, last_name, age) {
        return await db.query(
            `UPDATE people SET first_name = '${first_name}', last_name = '${last_name}', age = ${age} WHERE id = ${id} RETURNING *`
        )
    }

    async deleteRelation (id) {
        return await db.query(
            `DELETE FROM relation WHERE id = ${id} RETURNING *`
        )
    }
}

module.exports = new SQLQueries();