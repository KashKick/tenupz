CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE,
    is_guest BOOLEAN NOT NULL DEFAULT TRUE,

    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_daily_played DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    image TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE questions (
    id UUID PRIMARY KEY,
    source_id TEXT UNIQUE,

    category_id UUID NOT NULL REFERENCES categories(id),

    difficulty TEXT NOT NULL
        CHECK (difficulty IN ('easy', 'medium', 'hard')),

    question TEXT NOT NULL,

    answer_1 TEXT NOT NULL,
    answer_2 TEXT NOT NULL,
    answer_3 TEXT NOT NULL,
    answer_4 TEXT NOT NULL,

    correct_answer INTEGER NOT NULL
        CHECK (correct_answer BETWEEN 1 AND 4),

    explanation TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quizzes (
    id UUID PRIMARY KEY,
    
    type TEXT NOT NULL
        CHECK (type IN ('daily', 'category')),

    category_id UUID REFERENCES categories(id),

    date DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quiz_questions (
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),

    position INTEGER NOT NULL
        CHECK (position BETWEEN 1 AND 10),

    PRIMARY KEY (quiz_id, question_id),
    UNIQUE (quiz_id, position)
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL REFERENCES users(id),
    quiz_id UUID NOT NULL REFERENCES quizzes(id),

    score INTEGER
        CHECK (score BETWEEN 0 AND 10),

    xp_earned INTEGER NOT NULL DEFAULT 0,

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE quiz_attempt_answers (
    id UUID PRIMARY KEY,

    attempt_id UUID NOT NULL
        REFERENCES quiz_attempts(id)
        ON DELETE CASCADE,
    
    question_id UUID NOT NULL
        REFERENCES questions(id),
    
    selected_answer INTEGER NOT NULL
        CHECK (selected_answer BETWEEN 1 AND 4),

    is_correct BOOLEAN NOT NULL,
    xp_earned INTEGER NOT NULL DEFAULT 0,

    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (attempt_id, question_id)
);