import {AST_NODE_TYPES, AST_TOKEN_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";
import {FunctionExpression, MethodDefinition} from "@typescript-eslint/types/dist/ast-spec";
import {isCoreFeOrCoreNativeModuleClass} from "../util/isCoreFeOrCoreNativeModuleClass";

export const name = "explicit-module-class-method-return-type";

export type MessageIds = "explicitModuleClassMethodReturnType";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            explicitModuleClassMethodReturnType: "Require explicit return types on module class methods",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            ClassDeclaration(node) {
                if (isCoreFeOrCoreNativeModuleClass(context, node)) {
                    const sourceCode = context.getSourceCode();
                    node.body.body
                        .filter(
                            (classElement): classElement is MethodDefinition => classElement.type === AST_NODE_TYPES.MethodDefinition && classElement.value.type === AST_NODE_TYPES.FunctionExpression
                        )
                        .filter(method => !method.value.returnType)
                        .forEach(method => {
                            const fn = method.value as FunctionExpression;
                            const blockStatementRange = fn.body.range;
                            const firstCloseParentheses = sourceCode
                                .getTokens(fn)
                                .filter(_ => _.value === ")" && _.type === AST_TOKEN_TYPES.Punctuator)
                                .map(token => ({token, diff: blockStatementRange[0] - token.range[1]}))
                                .filter(_ => _.diff > 0)
                                .sort((a, b) => a.diff - b.diff)[0];

                            context.report({
                                messageId: "explicitModuleClassMethodReturnType",
                                node: method,
                                loc: method.key.loc,
                                fix: firstCloseParentheses && fn.generator ? fixer => fixer.insertTextAfterRange(firstCloseParentheses.token.range, ": SagaGenerator") : undefined,
                            });
                        });
                }
            },
        };
    },
});
