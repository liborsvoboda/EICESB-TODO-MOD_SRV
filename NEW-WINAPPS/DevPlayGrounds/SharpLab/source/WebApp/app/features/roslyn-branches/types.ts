export type BranchKind = 'roslyn'|'platform';

export interface Branch {
    readonly id: string;
    readonly name: string;
    readonly group: string;
    readonly kind: BranchKind;
    readonly url: string;

    // not received from server, set in code
    readonly displayName?: string;

    readonly feature?: {
        readonly language: string;
        readonly name: string;
        readonly url: string;
    };

    readonly merged?: boolean;
    readonly commits?: ReadonlyArray<Readonly<BranchCommit>>;

    readonly sharplab?: {
        readonly supportsUnknownOptions: boolean;
    };
}

export interface BranchCommit {
    readonly message: string;
    readonly author: string;
    readonly hash: string;
    readonly date: Date;
}