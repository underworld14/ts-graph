import { Resolver, Mutation, Arg, Int, InputType, Field, Query } from "type-graphql";
import { Movie } from "../entity/Movie";

@InputType()
class MovieInput {
  @Field()
  title: string;

  @Field(() => Int)
  duration: number;
}

@InputType()
class MovieUpdate {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;
}

@Resolver()
export class MovieResolver {
  @Mutation(() => Movie)
  async createMovie(@Arg("options", () => MovieInput) options: MovieInput) {
    return await Movie.create(options).save();
  }

  @Query(() => [Movie])
  async movies() {
    return await Movie.find();
  }

  @Query(() => Movie)
  async movie(@Arg("id", () => Int) id: number) {
    return await Movie.findOneOrFail(id);
  }

  @Mutation(() => Boolean)
  async updateMovie(
    @Arg("id", () => Int) id: number,
    @Arg("options", () => MovieUpdate) options: MovieUpdate
  ) {
    await Movie.update(id, options);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteMovie(@Arg("id", () => Int) id: number) {
    await Movie.delete({ id });
    return true;
  }
}
