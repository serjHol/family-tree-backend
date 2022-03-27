const SQLQueries = require("./SQLQueries.js")

class Constructors {
    async memberConstructor (data) {
        if (!(data.member && data.relations)) {
            throw new Error("Invalid input data in memberConstructor")
        }
        const member = await this.memberWithoutRelationsConstructor(data.member);
        
        const relatedMembersIds = data.relations.map((relation) => {
            return data.member.id === relation.id_1 ?
            relation.id_2 :
            relation.id_1;
        })
        const relationIds = data.relations.map(data => data.id)
        const relations = [];
        let tempMember;
        let tempRelationType;
        for (let i = 0; relatedMembersIds.length > i; i++) {
            tempMember = await SQLQueries.getMember(relatedMembersIds[i]);
            tempMember = await this.memberWithoutRelationsConstructor(tempMember.rows[0])
            
            tempRelationType = await this.relationConstructor(data.relations[i].type_id, tempMember.gender, relationIds[i], relatedMembersIds[i])
            if (tempRelationType) {
                relations.push({
                    id: relationIds[i],
                    member: tempMember,
                    relationType: tempRelationType
                });
            }
        }
        return {
            member, relations
        }
    }

    async memberWithoutRelationsConstructor (data) {
        if (!data) {
            throw new Error("Ivalid input data in memberConstructor")
        }
        const genderRow = await SQLQueries.getGenderById(data.gender_id);
        const gender = genderRow.rows[0].gender_value;
        return {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            age: data.age,
            gender
        }
    }

    async relationConstructor (typeId, gender, relationId, memberId) {

        const relationRow = await SQLQueries.getRelationById(relationId);
        const mainInRelation = relationRow.rows[0].id_1;


        
        const relationTypeRow = await SQLQueries.getRelationTypeById(typeId);

        const relationType = relationTypeRow.rows[0].type;


        

        
        if (relationType === "parentship") {
            if (memberId !== mainInRelation) {
                if (gender === "Male") {
                    return "Son"
                }
                return "Daughter"
            } else {
                if (gender === "Male") {
                    return "Father"
                }
                return "Mother"
            }
        } else if (relationType === "marriage") {
            if (gender === "Male") {
                return "Husband"
            }
            return "Wife"
        } else if (relationType === "brothership") {
            if (gender === "Male") {
                return "Brother"
            }
            return "Sister"
        }
        return false;
    }

    
}

module.exports = new Constructors();