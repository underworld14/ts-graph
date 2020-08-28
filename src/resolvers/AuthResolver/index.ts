import bcryptjs from "bcryptjs";
import { Resolver, Mutation, Arg, Ctx, Query, UseMiddleware } from "type-graphql";

import { User } from "../../entity/User";
import { registerInput, loginInput } from "./validation";
import { MyContext } from "../../types/MyContext";
import { isAuthenticated } from "../../middleware/isAuth";

@Resolver()
export class AuthResolver {
  @Mutation(() => User)
  async registerUser(
    @Arg("input", () => registerInput) options: registerInput
  ): Promise<User> {
    const data = await User.create({
      ...options,
      password: await bcryptjs.hash(options.password, 12),
    }).save();

    return data;
  }

  @Mutation(() => User)
  async loginUser(
    @Arg("input", () => loginInput) input: loginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOneOrFail({ where: { email: input.email } });
    const valid = await bcryptjs.compare(input.password, user.password);

    if (!valid) return null;

    ctx.req.session.userId = user.id;

    return user;
  }

  @Query(() => User)
  @UseMiddleware(isAuthenticated)
  async getMe(@Ctx() ctx: MyContext): Promise<User | null> {
    const userId = ctx.req.session.userId;
    if (!userId) return null;
    const user = await User.findOneOrFail({ where: { id: userId } });

    return user;
  }
}
