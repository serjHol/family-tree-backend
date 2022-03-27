const SQLQueries = require("./SQLQueries.js")
const Constructor = require("./constructors.js")

class Methods {
    async getFamily () {
        const membersRow = await SQLQueries.getFamilyMembers();
        const memberIds = membersRow.rows.map(member => member.id);
        
        const members = [];
        for (let i = 0; memberIds.length > i; i++) {
            members.push(await this.getMember(memberIds[i]))
        }
        return members;
    }

    async getMember (id) {
        const memberRows = await SQLQueries.getMember(id);
        const relationsRows = await SQLQueries.getMemberRelations(id);
        return Constructor.memberConstructor({
            member: memberRows.rows[0],
            relations: relationsRows.rows
        })
    }
    async createMember (first_name, last_name, age, relations, gender) {
        
        const genderIdRow = await SQLQueries.getGenderId(gender);
        const genderId = genderIdRow.rows[0].id;
        
        const memberRow = await SQLQueries.createMember(first_name, last_name, age, genderId);
        const member = memberRow.rows[0];

        if (relations) {
            for (let i = 0; relations.length > i; i++) {
                await this.createRelation(member.id, relations[i].id, relations[i].relation, relations[i].reverse)
            }
        }
        return await this.getMember(member.id);
    }

    async createRelation (id_1, id_2, relation, reverse = false) {
        const relationTypeIdRow = await SQLQueries.getRelationTypeIdByValue(relation);
        const relationTypeId = relationTypeIdRow.rows[0].id;
        if (reverse) {
            return await SQLQueries.createRelation(id_1, id_2, relationTypeId);
        }
        return await SQLQueries.createRelation(id_2, id_1, relationTypeId);
    }

    async deleteMember (id) {
        const deletedRelations = await SQLQueries.deleteAllMemberRelations(id);
        if (!deletedRelations) {
            return false;
        }
        const deletedMemberRows = await SQLQueries.deleteMember(id);
        if (!deletedMemberRows) {
            return false
        }
        return deletedMemberRows.rows[0];
    }
    
    async updateMember (id, first_name, last_name, age, relations) {
        const memberRows = await SQLQueries.getMember(id);
        const member = memberRows.rows[0];

        const updatedMemberRows = await SQLQueries.updateMember(
            id,
            first_name || member.first_name,
            last_name || member.last_name,
            age || member.age,
        );

        if (!updatedMemberRows) {
            return false;
        }

        if (relations) {
            if (relations.new?.length) {
                for (let i = 0; relations.new.length > i; i++) {
                    await this.createRelation(member.id, relations.new[i].id, relations.new[i].relation, relations.new[i].reverse)
                }
            }

            if (relations.delete?.length) {
                let relationToDelete;
                for (let i = 0; relations.delete.length > i; i++) {
                    relationToDelete = await SQLQueries.getRelationById(relations.delete[i])
                    if (member.id === relationToDelete.rows[0].id_1 || member.id === relationToDelete.rows[0].id_2)
                    await SQLQueries.deleteRelation(relations.delete[i]);
                }
            }
        }
        const relationsRows = await SQLQueries.getMemberRelations(member.id);
        const updatedMember = await Constructor.memberConstructor({
            member: updatedMemberRows.rows[0],
            relations: relationsRows.rows
        });
        return updatedMember;
    }
}

module.exports = new Methods();