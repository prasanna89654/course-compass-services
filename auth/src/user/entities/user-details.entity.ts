import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AcademicsType } from "@prisma/client";

@ObjectType()
export class UserDetail {
    @Field(() => Int , {description: "Id"})
    id: number;

    @Field(() => Int , {description: "User Id"})
    userId: number;

    @Field(() => Int , {description: "Study Level Id"})
    studyLevelId: number;

    @Field(() => Int , {description: "Institution Id"})
    institutionId: number;

    @Field(() => String , {description: "Academics Type"})
    academicsType: AcademicsType;

    @Field(() => Date , {description: "Created Date"})
    createdAt: Date;

    @Field(() => Date , {description: "Updated Date"})
    updatedAt: Date;
}


