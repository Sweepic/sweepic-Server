# Google Typescript style (GTS) 번역본

---

# 1. 소개

## **1.1 용어 정의 (중요 X)**

- **RFC 2119**에서 정의한 용어를 사용한다.
  - must: 반드시 따라야 하는 규칙
  - must not: 절대 따라서는 안 되는 규칙
  - should: 따르는 것이 좋지만 상황에 따라 예외가 있을 수 있는 규칙
  - should not: 따르지 않는 것이 좋지만 특정 상황에서는 예외가 허용될 수 있는 규칙
  - may: 선택적으로 따를 수 있는 내용
  - prefer: 따라야 하는 권장 사항(should)
  - avoid: 피해야 하는 권장 사항(should not)
  - 명령문 및 선언문: 반드시 따라야 하는 규칙(must)

## 1.2 가이드 노트

- 가이드에서 제시하는 모든 예제는 참고용이고, 구글 스타일을 이해하는 데 도움을 주기 위함이다. 그러나 예제의 특정 코드 표현이 유일하게 옳은 방식인 것이 아니므로 예제에서 사용된 코드 표현이 규칙으로 강요되어선 안된다.

---

# 2. 소스 파일 기본 사항

## 2. 1 파일 인코딩: UTF-8

- UTF-8: 텍스트 데이터를 저장하거나 교환할 때 사용되는 문자 인코딩 방식
  - 모든 언어와 특수 문자를 표현할 수 있다.
  - 기본적으로 영어 알파벳과 숫자 같은 ASCII 문자는 1바이트로 저장된다.
  - 한글, 한자, 이모지 같은 비ASCII 문자는 2~4바이트로 저장된다.
- 모든 파일은 UTF-8 형식을 사용해야 한다.

### 2.1.1 공백 문자

- 소스 파일에서 허용되는 공백 문자: ASCII의 수평 공백 문자(0x20) → 키보드의 스페이스 바로 입력되는 빈 칸
- 줄 바꿈 문자를 제외하고 다른 공백 문자가 사용될 경우 문자열 리터럴 안에서는 반드시 이스케이프 처리를 해야 한다.
  - 이스케이프 처리: 특수 문자를 문자열에서 제대로 표현하기 위해 사용하는 문법

### 2.1.2 특수 이스케이프 시퀀스

- 아래의 특수 문자에는 항상 해당하는 특수 이스케이프 시퀀스를 사용한다.
  - `\'`: 작은 따옴표
  - `\"`: 큰 따옴표
  - `\\`: 역슬레시
  - `\b`: 백스페이스 (커서를 한 문자 뒤로 이동시켜 그 자리에 새로운 내용을 덮어쓰거나 삭제) ex. "Hello\b World!” → “Hell World!”
  - `\f`: 폼 피드 (새로운 페이지로 이동)
  - `\n`: 줄 바꿈
  - `\r`: 캐리지 리턴 (커서를 현재 줄의 맨 앞으로 이동) ex. "Hello\rWorld!” → “World!o”
  - `\t`: 탭
  - `\v`: 수직 탭 (커서를 다음 줄로 이동 후 수직으로 간격 추가)
- 숫자 코드로 표현된 이스케이프(ex. `\x0a`, `\u000a`, `\u{a}`는 사용하지 않는다. 레거시 8진수 이스케이프는 절대로 사용하지 않아야 한다.

### 2.1.3 비ASCII 문자

- 비ASCII 문자는 화면에 출력 가능한 경우(읽는 사람이 의미를 바로 알 수 있는 경우) 실제 유니코드 문자로 작성한다.
- ex. 무한대 기호 → `∞`로 작성하나 화면에 출력되지 않는 문자라면 유니코드 이스케이프(ex. `\u221e`)를 사용해 작성한다. + 해당 문자가 무엇을 의미하는지 주석으로 설명을 추가한다.
- 이런 식으로 코드 가독성을 유지하고 문자에 대한 명확한 의미를 전달할 수 있다.
- ex. 좋은 예시

  ```jsx
  // 명확한 비ASCII 문자 사용
  const units = 'μs'; // 문자가 눈으로 바로 확인 가능 -> 유니코드 이스케이프 없이 작성

  // 이스케이프가 필요한 비ASCII 문자
  const output = '\ufeff' + content; // 바이트 순서 표시 (유니코드 이스케이프 사용 후 주석 추가)
  ```

- 잘못된 예시

  ```jsx
  // 비ASCII 문자를 이스케이프로 표현
  const units = '\u03bcs'; // 그리스 문자 'μ' (사람이 읽기에 복잡하고 실수하기 쉬운 코드)

  // 출력 불가능한 문자에 대한 명확성 부족
  const output = '\ufeff' + content; // 주석이 없어 코드의 의미 이해가 어렵다.
  ```

---

# 3. 소스 파일 구조

> 소스 파일은 다음 순서로 구성된다.
>
> 1. 저작권 정보: (Copyright information): 필요한 경우 파일의 맨 위에 작성한다.
> 2. @fileoverview JSDoc: 파일 개요를 설명하는 주석이 필요한 경우에 작성한다.
> 3. imports: 필요한 외부 모듈이나 파일을 가져오는 코드
> 4. 파일 구현: 파일의 실제 코드 구현
>
> → 각 섹션은 정확히 한 줄의 빈 줄로 구분한다.

## 3.1 저작권 정보

- 파일에 저작권 정보나 라이선스 정보를 추가해야 하는 경우 파일의 최상단에 JSDoc 주석 형태로 작성한다.
- ex.
  ```jsx
  /**
   * Copyright 2025 MyCompany. All rights reserved.
   * Licensed under the MIT License.
   */
  ```

## 3.2 @fileoverview JSDoc

- `@fileoverview` 주석은 파일의 내용, 용도, 의존성 정보를 설명하는 데 사용된다.
- 필요한 경우 파일 상단에 작성한다.
- 줄 바꿈된 내용은 들여쓰기 없이 작성한다.
- ex.
  ```jsx
  /**
   * @fileoverview Description of file. Lorem ipsum dolor sit amet, consectetur
   * adipiscing elit, sed do eiusmod tempor incididunt.
   */
  ```

## 3.3 Imports

- ES6과 TypeScript의 import 문법은 4가지 유형으로 나뉜다.
  1. 모듈 전체를 가져오는 import `import * as foo from '...';`
     - 주로 모듈의 모든 기능을 한 객체로 묶어 사용하는 경우 적합하다.
  2. 이름 지정 import `import {SomeThing} from '...';`
     - TypeScript에서 모듈 내에서 특정한 항목만 가져올 때 사용한다.
     - 구조 분해(destructing) 방식으로 필요한 기능만 선택적으로 가져온다.
  3. 기본 import `import SomeThing from '...';`
     - 외부 라이브러리나 코드가 기본 내보내기를 사용하는 경우에만 사용한다.
     - 프로젝트 내부에서 사용하는 것은 권장되지 않는다.
  4. 사이드 이펙트만을 위한 import `import '...';`
     - 라이브러리를 가져오는 것만으로 특정 부작용(side effects)을 발생시키는 경우 사용된다.
     - ex. 커스텀 요소 로드, 테스트 환경에서의 설정 초기화

### 3.3.1 import 경로 규칙

- TypeScript 코드 import 시 반드시 경로(path)를 사용해야 한다.
  1. 상대 경로 (relative path): . 또는 ..로 시작하는 경로 (ex. ./file, ../file)
  2. 루트 디렉토리 기준 경로 (rooted path): 프로젝트의 기본 디렉토리를 기준으로 작성된 경로 (ex. root/path/to/file)
- 같은 프로젝트 내의 파일을 import 시 상대 경로를 사용하는 것이 좋다.
  - 상대 경로를 사용하면 프로젝트의 디렉토리 구조가 변경되더라도 import 경로를 수정할 필요가 없다.
  ```jsx
  import {Symbol} from 'path/to/foo'; // 절대 경로
  import {Symbol} from './foo'; // 상대 경로 -> 권장!!
  ```
- 상대 경로 사용 시 부모 디렉토리로 올라가는 단계(../../../)를 최소화하는 것이 좋다.
  - 너무 많은 디렉토리 단계는 경로를 이해하기 어렵게 만들고 모듈 및 경로 구조를 복잡하게 만든다.
  - 파일 위치를 적절히 조정하거나 디렉토리 구조를 간소화하여 과도한 경로 단계를 줄인다.
  ```jsx
  import {something} from '../parent/file'; // 부모 디렉토리에서 import
  import {something} from './sibling'; // 같은 디렉토리에서 import
  ```

### 3.3.2 Namespace vs Named Imports

- Named Imports (이름 지정 import)
  - 특정 심볼(ex. 함수, 클래스)을 직접 지정해서 가져오는 방식
  - 파일 내에서 자주 사용되는 심볼이나 명확한 이름을 가진 경우에 주로 사용된다.
  - 필요한 경우 as 키워드를 사용해 가져온 심폴을 더 명확한 이름으로 별칭(alias) 지정이 가능하다.
    ```jsx
    import {describe as **testDescribe**} from './testing';
    ```
- Namespace Imports (네임스페이스 Import)
  - 모듈의 모든 내보낸(exported) 심볼을 한 객체로 가져오는 방식
  - 다양한 심볼을 가져와야 하는 대규모 API의 경우에 주로 사용된다.
  - 내보낸 심볼이 공통적인 이름(ex. Model, Controller)을 가지고 있을 때 네임스페이스를 활용해 가독성을 높일 수 있다.
    ```jsx
    import * as tableview from './tableview';
    let item: tableview.Item | undefined;
    ```
- 안 좋은 사례 & 개선점

  - 불필요하게 긴 named import
    ```jsx
    import {Item as **TableviewItem**, Header as **TableviewHeader**} from './tableview';
    let item: TableviewItem | undefined;
    ```
    - 너무 많은 별칭으로 가독성이 저하된다.
    - 개선: 네임스페이스를 활용한다.
      ```jsx
      import ***** as tableview from './tableview';
      let item: **tableview.Item** | undefined;
      ```
  - 네임스페이스 사용으로 가독성 저하

    ```jsx
    import * as testing from './testing';

    testing.describe('foo', () => {
      testing.it('bar', () => {
        testing.expect(null).toBeNull();
      });
    });
    ```

    - 간단한 함수들에 네임스페이스를 사용해 복잡해진다.
    - 개선: 자주 사용되는 함수들은 named import로 가져온다.

      ```jsx
      import {describe, it, expect} from './testing';

      describe('foo', () => {
        it('bar', () => {
          expect(null).toBeNull();
        });
      });
      ```

- 특수한 사례: Apps JSPB protos

  - JSPB(proto) 파일에서는 반드시 named import를 사용해야 한다.

    - 프로토 파일에서는 많은 메시지가 포함되어 있으나 모두 필요한 것은 아니기 때문에 named import로 가져오면 빌드 성능을 높이고 불필요한 코드 제거가 가능하다.

    ```jsx
    // good example: 필요한 심볼만 가져온다.
    import {Foo, Bar} from './foo.proto';

    function copyFooBar(foo: Foo, bar: Bar) { ... }
    ```

### 3.3.3 Import 이름 변경

- 필요한 경우 이름 충돌을 방지하거나 코드 가독성을 높이기 위해 import 이름을 변경할 수 있습니다.
- 이름 변경이 유용한 3가지 상황
  1. 이름 충돌 방지: 다른 모듈의 심볼과의 충돌을 피할 경우
  2. 생성된 이름 사용: 심볼 이름이 자동으로 생성된 경우
  3. 가독성 개선: 심볼 이름이 불명확한 경우 더 직관적인 이름으로 변경한다.
  - ex. RxJS의 from을 observableFrom으로 변경할 경우
    ```jsx
    import {from as observableFrom} from 'rxjs';
    ```

## 3.4 Exports

- **Named Exports 사용 권장**
  - 모든 코드에서 named exports(이름 지정 내보내기)를 사용하는 것이 권장된다.
    ```jsx
    export class Foo { ... }
    export const SOME_CONSTANT = ...;
    export function someHelpfulFunction() { ... }
    ```
  - 명확한 이름 제공
    - named exports는 각 심볼에 대해 고유하고 명확한 이름을 제공한다. 이는 오류를 방지하고 코드의 가독성과 유지보수성을 높여준다.
      ```jsx
      export const SOME_CONSTANT = ...;
      export function someHelpfulFunction() { ... }
      export class Foo { ... }
      ```
  - 파일 범위 네임스페이스 활용
    - 파일 자체를 네임스페이스처럼 사용하여 필요 없는 추가 스코프를 줄인다.
      ```jsx
      export const SOME_CONSTANT = ...;
      export function someHelpfulFunction() { ... }
      export class Foo {
        // 클래스 관련 코드만 포함
      }
      ```
- **Default Exports 사용 금지**
  - default exports(기본 내보내기)는 사용하지 않는 것이 좋다.
  - default exports는 해당 파일에서 하나의 클래스만 기본적으로 내보낼 수 있다.
    ```jsx
     export default class Foo { ... } // 사용 금지
    ```
  - 정확한 이름이 보장되지 않는다.
    - 특정 내보내기(export)에 대해 고정된 이름(표준 이름)을 제공하지 않는다. 이는 코드 관리 및 유지보수를 어렵게 한다.
      ```jsx
      import Foo from './bar';
      import Bar from './bar';
      ```
      - 서로 다른 이름으로 같은 모듈을 가져올 수 있으므로 코드 읽기가 혼란스러워질 수 있다.
  - 명시적 에러를 제공하지 않는다.
    - 잘못된 import로 인해 디버깅이 어려워질 수 있다.
      - named exports는 아래와 같이 명확한 에러를 제공한다.
        ```jsx
        // foo.ts
        const foo = 'blah';
        export default foo;
        ```
        ```jsx
        // bar.ts
        import {fizz} from './foo'; // Error: TS2614 - './foo' 모듈에 'fizz'가 없습니다.
        ```
      - 반면 default exports 사용 시
        ```jsx
        // bar.ts
        import fizz from './foo'; // fizz === foo (예상과 다를 수 있음)
        // 'fizz'라는 이름은 의미 없고, 실수로 잘못된 이름을 써도 작동한다.
        ```
        - 잘못된 동작을 디버깅하기 어려워질 수 있다.
  - 불필요한 네임스페이스 남용
    - default exports는 모든 내용을 하나의 큰 객체로 묶어 네임스페이스처럼 사용하는 경향이 있다.
      ```jsx
      export default class Foo {
        static SOME_CONSTANT = ...;
        static someHelpfulFunction() { ... }
      }
      ```
      - 이는 파일 단위 네임스페이스 외에 불필요한 클래스 Foo라는 추가 스코프를 만든다.
      - 이로 인해, 해당 클래스가 다른 파일에서 타입과 값으로 모두 사용될 수 있어 혼란을 야기할 수 있다.

### 3.4.1 Export 가시성(Visibility)

- TypeScript에서는 내보낸(exported) 심볼의 가시성을 제한하는 기능을 지원하지 않는다.
- 즉, 모듈 외부에서 사용되는 심볼만 export해야 하며, 모듈의 API 표면적을 최소화하는 것이 좋다.

  1. 필요한 기능만 export

     ```jsx
     export function publicFunction() {
       console.log('This function is for external use!');
     }

     function privateFunction() {
       console.log('This function is internal only.');
     }
     ```

  2. `index.ts`를 사용한 API 관리

     ```jsx
     // foo.ts
     export function foo() {
       console.log('Foo');
     }

     export function bar() {
       console.log('Bar');
     }

     // index.ts
     export {foo} from './foo'; // bar는 export하지 않음
     ```

### 3.4.2 Mutable Exports (변경 가능한 Export)

- export let은 사용하지 않는 것이 원칙이다.

  - 변경 가능한 export는 코드의 동작을 이해하기 어렵게 만들고 디버깅을 복잡하게 만든다.
    ```jsx
    export let foo = 3;
    setTimeout(() => {
      foo = 4; // foo 값이 변경됨.
    }, 1000);
    ```
    - ES6에서는 foo의 변경 사항을 import한 모듈에서 관찰할 수 있지만 TypeScript에서 foo가 다른 파일에서 재-export 될 경우 값 변경이 동작하지 않을 수 있다.
  - 대안: 외부에서 접근 및 변경이 가능한 값 필요 시, getter 함수를 사용한다.

    ```jsx
    let foo = 3;
    setTimeout(() => {
      foo = 4;
    }, 1000);

    export function getFoo() {
      return foo; // 변경된 값을 안전하게 반환.
    }
    ```

- 조건부 Export

  - 조건에 따라 다른 값을 export 해야 하는 경우 조건부 로직을 먼저 실행하고 그 결과를 export 한다.

    ```jsx
    function pickApi() {
      if (useOtherApi()) return OtherApi;
      return RegularApi;
    }

    export const SomeApi = pickApi(); // 조건에 따라 최종적으로 결정된 값을 export
    ```

### 3.4.3 Container 클래스 사용 금지

- 네임스페이싱을 위해 컨테이너 클래스를 생성하지 말아야 한다.
  ```jsx
  export class Container {
    static FOO = 1;
    static bar() {
      return 1;
    }
  }
  ```
  - 이는 불필요하게 클래스 스코프를 추가해 가독성을 떨어뜨린다.
  - 대안: 개별적으로 상수와 함수를 export 한다.
    ```jsx
    export const FOO = 1;
    export function bar() {
      return 1;
    }
    ```

## **3.5 Import & export type**

### 3.5.1 Import Type

- 가져온 심볼을 타입으로만 사용할 때 사용하는 방식
- 값(value)으로 사용하는 경우에는 일반 import를 사용한다.

```jsx
import type {Foo} from './foo'; // Foo는 타입으로만 사용
import {Bar} from './foo';      // Bar는 값으로 사용
import {type Foo, Bar} from './foo'; // 혼합 사용
```

- TypeScript 컴파일러는 타입 참조에 대해 런타임 로드(runtime load)를 생성하지 않는다. 즉, 타입은 컴파일 시에만 사용되고 실행 시엔 영향을 미치지 않는다.
  - 컴파일의 2가지 모드
    1. 개발 모드
       - 빠른 개발 속도를 위해 JavaScript로 트랜스파일하며 모든 타입 정보를 완전히 확인하지 않을 수 있다.
       - 이 모드에서는 일부 경우에 `import type`이 필요하다.
    2. 프로덕션 모드
       - 모든 타입을 검사하고 `import type`이 적절히 사용되었는지 확인한다.
- 주의: 사이드 이펙트를 발생시키기 위해 런타임 로드가 필요하다면 `import '...'`를 사용한다.
  ```jsx
  import './side-effect-module'; // 모듈을 로드해 부작용 발생.
  ```

### 3.5.2 Export Type

- 타입을 재-export할 때 사용한다.

```jsx
export type {AnInterface} from './foo';
```

- 파일별 트랜스파일링(file-by-file transpilation)하기 위해 사용된다.
  - ex. isolatedModules 모드에서 유용하다.
- 주의: 값을 내보내지 않는다고 보장하지 않는다.
  - export type은 API에서 값을 내보내지 않겠다는 보장을 제공하지 않는다.
  - 다른 경로를 통해 API를 가져오면 여전히 값 심볼을 가져올 수 있다.
- 대안: 타입과 값을 구분하려면 심볼 자체를 분리하는 것이 더 안전하고 명확하다.
  - ex. UserService(타입 전용)와 AjaxUserService(값 전용)를 따로 분리한다.
  - 이는 의도를 더 잘 전달하며 실수를 줄일 수 있다.

### 3.5.3 네임스페이스 대신 모듈을 사용한다.

- TypeScript는 코드를 구성하는 2가지 방법(1. 네임스페이스 2. 모듈)을 지원한다.
- 그러나 네임스페이스는 사용하지 않는 것이 원칙이며 ES6 모듈 시스템을 사용해야 한다.

  ```jsx
  import {foo} from 'bar'; // ES6 모듈을 사용한 올바른 방식
  ```

  - `namespace Foo { ... }` 구문은 코드 내에서 사용하지 말아야 한다.
  - 대안: 코드를 파일 단위로 나누고 import/export를 통해 모듈화한다.

    - 잘못된 예시
      ```jsx
      namespace Rocket {
        function launch() { ... }
      }
      ```
    - 개선

      ```jsx
      // rocket.ts
      export function launch() { ... }

      // main.ts
      import {launch} from './rocket';
      ```

  - 예외: 네임스페이스는 외부 서드파티 코드와의 인터페이스를 위해 필요한 경우에만 사용할 수 있다.

- `<reference>` 구문은 더 이상 사용하지 않아야 한다.
  - 잘못된 예시
    ```jsx
    /// <reference path="..." />
    ```
    - 모든 의존성은 import/export로 관리해야 한다.
- `require()` 또는 `import x = require('...')`와 같은 구문은 사용하지 않아야 한다.
  - 잘못된 예시
    ```jsx
    import x = require('mydep');
    ```
    - 개선: ES6 모듈 구문을 사용한다.
      ```jsx
      import x from 'mydep';
      ```
- 내부 모듈을 사용하지 않아야 한다.
  - TypeScript의 네임스페이스는 이전에는 내부 모듈(Internal Modules)로 불리며 `module` 키워드를 사용했다. 이는 더 이상 사용하지 말아야 하며 항상 ES6 모듈 시스템을 사용해야 한다.
    - 잘못된 예시
      ```jsx
      module Foo {
        function bar() { ... }
      }
      ```

---

# 4 Language features

이 섹션은 어떤 기능을 사용할 수 있고 사용할 수 없는지를 구체적으로 설명하며, 해당 기능의 사용에 대한 추가적인 제한 사항을 명시합니다.

이 스타일 가이드에서 논의되지 않은 언어 기능은 사용에 대해 별도의 권장 사항 없이 자유롭게 사용할 수 있습니다.

## 4.1 Local variable declarations

### 4.1.1 Use const and let

항상 변수를 선언할 때 `const` 또는 `let`을 사용하세요. 기본적으로 `const`를 사용하고, 변수가 재할당될 필요가 있는 경우에만 `let`을 사용하세요.
⚠️`var`는 절대 사용하지 마세요.

```tsx
const foo = otherValue; // "foo"가 변경되지 않을 경우 사용합니다.
let bar = someValue; // "bar"가 이후에 할당될 가능성이 있을 경우 사용합니다.
```

`const`와 `let`은 대부분의 다른 언어에서와 마찬가지로 블록 스코프를 가집니다. 반면, JavaScript의 `var`는 함수 스코프를 가지며, 이해하기 어려운 버그를 유발할 수 있으므로 사용하지 마세요.

```tsx
var foo = someValue; // 사용하지 마세요 - var의 스코핑은 복잡하며 버그를 유발할 수 있습니다.
```

변수는 선언 전에 사용되어서는 안 됩니다.

### 4.1.2 한 번에 하나의 변수만 선언하기

로컬 변수 선언 시 하나의 변수만 선언합니다. `let a = 1, b = 2;`와 같은 방식은 사용하지 마세요.

## 4.2 배열 리터럴

### 4.2.1 배열 생성자 사용 금지

`Array()` 생성자(또는 `new Array()`)를 사용하지 마세요.

```tsx
const a = new Array(2); // [undefined, undefined]
const b = new Array(2, 3); // [2, 3]
```

대신, 항상 대괄호(`[]`)를 사용하여 배열을 초기화하거나, 배열 크기를 지정하려면 `Array.from`을 사용하세요.

```tsx
const a = [2];
const b = [2, 3];

// Array(2)와 동일한 초기화
const c = [];
c.length = 2;

// [0, 0, 0, 0, 0]
Array.from<number>({length: 5}).fill(0);
```

### 4.2.2 배열에 속성 정의 금지

배열에 숫자가 아닌 속성(`length` 제외)을 정의하거나 사용하지 마세요. 대신 `Map` 또는 `Object`를 사용하세요.

### 4.2.3 스프레드 문법 사용

스프레드 문법`[…foo];` 은 얕은 복사나 이터러블을 연결할 때 편리한 축약형입니다.

```tsx
const foo = [1];

const foo2 = [...foo, 6, 7];

const foo3 = [5, ...foo];

foo2[1] === 6;
foo3[1] === 1;
```

스프레드 문법을 사용할 때는 생성하려는 값과 스프레드 대상이 일치해야 합니다. 배열을 생성할 때는 이터러블만 스프레드하세요. 원시 값(`null`, `undefined` 포함)은 스프레드하지 마세요.

```tsx
const foo = [7];
const bar = [5, ...(shouldUseFoo && foo)]; // undefined가 될 수 있음

// 비추천
const fooStrings = ['a', 'b', 'c'];
const ids = {...fooStrings}; // {0: 'a', 1: 'b', 2: 'c'}이 생성되지만 length 없음
```

올바른 예:

```tsx
const foo = shouldUseFoo ? [7] : [];
const bar = [5, ...foo];
const fooStrings = ['a', 'b', 'c'];
const ids = [...fooStrings, 'd', 'e'];
```

### 4.2.4 배열 구조 분해

배열 리터럴은 할당의 왼쪽에 사용하여 구조 분해를 수행할 수 있습니다. 이는 하나의 배열 또는 이터러블에서 여러 값을 분해할 때 유용합니다. 마지막 요소로 나머지(rest) 요소를 포함할 수 있으며, 나머지 변수명 앞에 공백을 두지 마세요. 사용하지 않는 요소는 생략하세요.

```tsx
const [a, b, c, ...rest] = generateResults();
let [, b, , d] = someArray;
```

함수 매개변수에서 구조 분해를 사용할 수 있습니다. 선택적인 배열 매개변수에는 항상 `[]`를 기본값으로 지정하고, 왼쪽 요소에 기본값을 제공하세요.

```tsx
function destructured([a = 4, b = 2] = []) { … }
```

잘못된 예:

```tsx
function badDestructuring([a, b] = [4, 2]) { … }
```

> 팁:
> 함수 매개변수나 반환값에서 여러 값을 패킹/언패킹할 경우, 가능하다면 배열 구조 분해보다 객체 구조 분해를 선호하세요. 이를 통해 개별 요소에 이름을 지정하고 각 요소에 대해 다른 타입을 지정할 수 있습니다.

## 4.3 객체 리터럴

### 4.3.1 Object 생성자 사용 금지

`Object` 생성자는 사용하지 마세요. 대신 객체 리터럴(`{}` 또는 `{a: 0, b: 1, c: 2}`)을 사용하세요.

### 4.3.2 객체 반복

`for (... in ...)` 문은 오류를 유발할 가능성이 높습니다. 이 반복문은 프로토타입 체인에서 상속된 열거 가능한 속성을 포함할 수 있습니다.

`for (... in ...)` 문을 필터 없이 사용하지 마세요:

```tsx
for (const x in someObj) {
  // x는 부모 프로토타입에서 상속될 수 있습니다!
}
```

대신, `if` 문으로 값을 명시적으로 필터링하거나 `for (... of Object.keys(...))`를 사용하세요:

```tsx
for (const x in someObj) {
  if (!someObj.hasOwnProperty(x)) continue;
  // 이제 x는 someObj에 정의된 값임이 확실합니다.
}

for (const x of Object.keys(someObj)) {
  // 주의: for _of_ 사용!
  // 이제 x는 someObj에 정의된 값임이 확실합니다.
}

for (const [key, value] of Object.entries(someObj)) {
  // 주의: for _of_ 사용!
  // 이제 key는 someObj에 정의된 값임이 확실합니다.
}
```

### 4.3.3 스프레드 문법 사용

스프레드 문법(`{...bar}`)은 객체의 얕은 복사를 생성하는 편리한 축약형입니다. 객체 초기화 시 스프레드 문법을 사용할 때, 동일한 키에 대해 나중의 값이 이전 값을 덮어씁니다.

```tsx
const foo = {
  num: 1,
};

const foo2 = {
  ...foo,
  num: 5,
};

const foo3 = {
  num: 5,
  ...foo,
};

foo2.num === 5;
foo3.num === 1;
```

스프레드 문법을 사용할 때는 확장되는 값이 생성 중인 값과 일치해야 합니다. 즉, 객체를 생성할 때는 객체만 확장할 수 있으며, 배열이나 원시 값(`null`, `undefined` 포함)은 확장할 수 없습니다. `Object` 프로토타입 이외의 프로토타입을 가진 객체(예: 클래스 정의, 클래스 인스턴스, 함수)를 확장하는 것도 피하세요. 이러한 경우 동작이 직관적이지 않습니다(열거 가능한 비-프로토타입 속성만 얕은 복사가 이루어짐).

```tsx
const foo = {num: 7};
const bar = {num: 5, ...(shouldUseFoo && foo)}; // undefined가 될 가능성 있음

// {0: 'a', 1: 'b', 2: 'c'}를 생성하지만 길이(length)는 없음
const fooStrings = ['a', 'b', 'c'];
const ids = {...fooStrings};
//------------------------------------------------------------------
const foo = shouldUseFoo ? {num: 7} : {};
const bar = {num: 5, ...foo};
```

### 4.3.4 계산된 속성 이름

계산된 속성 이름(예: `{['key' + foo()]: 42}`)은 허용되며, 딕셔너리 스타일(따옴표를 사용하는) 키로 간주됩니다.

계산된 속성이 심볼(`symbol`)이 아닌 경우, 비-따옴표 키와 혼합해서 사용하지 마세요(예: `{[key]: value, otherKey: 5}`는 허용되지 않음).

### 4.3.5 객체 구조 분해

객체 구조 분해는 할당문의 왼쪽에 사용되어 구조 분해를 수행하고 단일 객체에서 여러 값을 추출할 수 있습니다.

구조 분해된 객체는 함수 매개변수로도 사용할 수 있지만, 단순하게 유지해야 합니다. 매개변수 구조 분해 시 하나의 수준에서 따옴표 없는 단축 속성만 허용됩니다. 더 깊은 중첩과 계산된 속성은 매개변수 구조 분해에서 사용할 수 없습니다.

구조 분해된 매개변수에 기본값을 지정할 때는 왼쪽에 기본값을 명시하세요(`{str = 'default'} = {}` 형식으로). 선택적 구조 분해 객체의 경우, 기본값은 항상 `{}`여야 합니다.

예제:

```tsx
interface Options {
  /** 작업을 수행할 횟수 */
  num?: number;

  /** 처리할 문자열 */
  str?: string;
}

function destructured({num, str = 'default'}: Options = {}) {}
```

허용되지 않는 예:

```tsx
function nestedTooDeeply({x: {num, str}}: {x: Options}) {}
function nontrivialDefault({num, str}: Options = {num: 42, str: 'default'}) {}
```

> 팁:
> 함수 매개변수나 반환값에서 여러 값을 패킹/언패킹할 때, 가능하면 배열 구조 분해보다 객체 구조 분해를 사용하세요. 이를 통해 개별 요소에 이름을 지정할 수 있으며, 각 요소에 대해 서로 다른 타입을 명시할 수 있습니다.

## 4.4 클래스

### 4.4.1 클래스 선언

클래스 선언은 세미콜론(`;`)으로 종료하지 않습니다:

```tsx
class Foo {}
class Foo {} // 불필요한 세미콜론
```

반면, 클래스 표현식을 포함하는 문(statement)은 세미콜론으로 종료해야 합니다:

```tsx
export const Baz = class extends Bar {
  method(): number {
    return this.x;
  }
}; // 이 경우 세미콜론이 필요합니다.
```

클래스 선언의 중괄호와 클래스 내용 사이에 공백 줄을 넣는 것은 필수도 아니고 권장하지도 않습니다. 다음과 같은 방식 모두 허용됩니다:

```tsx
// 중괄호 주위에 공백 없음 - 허용됨.
class Baz {
  method(): number {
    return this.x;
  }
}

// 중괄호 주위에 하나의 공백 줄 - 허용됨.
class Foo {
  method(): number {
    return this.x;
  }
}
```

### 4.4.2 클래스 메서드 선언

클래스 메서드 선언은 각 메서드 선언을 세미콜론으로 구분하지 않습니다:

```tsx
class Foo {
  doThing() {
    console.log('A');
  }
}
class Foo {
  doThing() {
    console.log('A');
  } // <-- 불필요한 세미콜론
}
```

메서드 선언은 주변 코드와 하나의 공백 줄로 구분해야 합니다:

```tsx
class Foo {
  doThing() {
    console.log('A');
  }

  getOtherThing(): number {
    return 4;
  }
}
```

잘못된 예:

```tsx
class Foo {
  doThing() {
    console.log('A');
  }
  getOtherThing(): number {
    return 4;
  }
}
```

---

**`toString` 메서드 재정의**

`toString` 메서드는 재정의할 수 있지만, 반드시 항상 성공해야 하며, 가시적인 부작용이 없어야 합니다.

> 팁:
> 특히 `toString`에서 다른 메서드를 호출할 때 주의하세요. 예외 상황이 발생하면 무한 루프로 이어질 수 있습니다.

### 4.4.3 정적 메서드

**비공개 정적 메서드 사용 지양**

가독성에 지장이 없다면, 비공개 정적 메서드(private static method) 대신 모듈 로컬 함수(module-local function)를 사용하는 것을 선호하세요.

---

**동적 디스패치 사용 금지**

정적 메서드는 동적 디스패치(dynamic dispatch)에 의존하지 않아야 합니다. 정적 메서드는 직접 정의된 기본 클래스(base class)에서만 호출해야 합니다.

정적 메서드를 다음과 같은 경우에 호출하지 마세요:

1. 생성자나 서브클래스 생성자를 포함할 수 있는 동적 인스턴스 변수에서 호출. (이 경우 `@nocollapse`로 정의해야 하지만 지양됨)
2. 정적 메서드가 정의되지 않은 서브클래스에서 직접 호출.

**허용되지 않는 예**:

```tsx
// 다음 클래스 자체는 문제없음
class Base {
  /** @nocollapse */ static foo() {}
}
class Sub extends Base {}

// 권장하지 않음: 정적 메서드를 동적으로 호출하지 마세요.
function callFoo(cls: typeof Base) {
  cls.foo();
}

// 허용되지 않음: 정적 메서드가 정의되지 않은 서브클래스에서 호출하지 마세요.
Sub.foo();

// 허용되지 않음: 정적 메서드 내에서 `this`를 사용하지 마세요.
class MyClass {
  static foo() {
    return this.staticField;
  }
}
MyClass.staticField = 1;
```

---

**정적 this 참조 금지**

정적 컨텍스트에서 `this`를 사용하지 마세요.

JavaScript는 정적 필드(static field)를 `this`를 통해 접근할 수 있습니다. 이는 다른 언어와 다르게 정적 필드가 상속되기 때문입니다.

```tsx
class ShoeStore {
  static storage: Storage = ...;

  static isAvailable(s: Shoe) {
    // 잘못된 예: 정적 메서드에서 `this`를 사용하지 마세요.
    return this.storage.has(s.id);
  }
}

class EmptyShoeStore extends ShoeStore {
  static storage: Storage = EMPTY_STORE;  // ShoeStore의 storage를 재정의
}

```

---

**이유**

1. 정적 필드를 `this`를 통해 접근할 수 있다는 점은 일반적으로 예측하기 어렵습니다. 또한, 이 필드가 재정의될 수 있다는 사실에 놀랄 수 있습니다. 이 기능은 일반적으로 많이 사용되지 않습니다.
2. 정적 상태(static state)를 과도하게 사용하는 안티패턴을 조장합니다. 이는 테스트 가능성(testability)에 문제를 야기할 수 있습니다.

### 4.4.4 생성자

**생성자 호출 시 괄호 사용**

생성자를 호출할 때는 인수가 없더라도 항상 괄호를 사용해야 합니다.

**올바른 예:**

```tsx
const x = new Foo();
```

**잘못된 예:**

```tsx
const x = new Foo();
```

괄호를 생략하면 미묘한 오류가 발생할 수 있습니다. 아래 두 줄은 동등하지 않습니다:

```tsx
new Foo().Bar(); // Foo의 인스턴스를 생성한 후 Bar 메서드 호출
new Foo.Bar(); // Foo 클래스의 Bar 정적 메서드 호출
```

---

**빈 생성자 생략**

ES2015는 생성자가 지정되지 않은 경우 기본 생성자를 제공합니다. 따라서 다음과 같은 빈 생성자는 불필요합니다:

```tsx
class UnnecessaryConstructor {
  constructor() {}
}

class UnnecessaryConstructorOverride extends Base {
  constructor(value: number) {
    super(value);
  }
}
```

하지만 다음 경우에는 생성자를 생략하지 마세요:

- **매개변수 속성(parameter properties):** 생성자 매개변수에 `private`, `public`, `readonly` 등 접근 제한자가 포함된 경우.
- **매개변수 데코레이터(parameter decorators):** 생성자 매개변수에 데코레이터가 포함된 경우.

**예시:**

```tsx
class ParameterProperties {
  constructor(private myService) {}
}

class ParameterDecorators {
  constructor(@SideEffectDecorator myService) {}
}
```

또한, **인스턴스화를 방지하기 위한 비공개 생성자(private constructor)**는 허용됩니다:

```tsx
class NoInstantiation {
  private constructor() {}
}
```

---

### 코드와의 공백

생성자는 위아래로 하나의 공백 줄로 주변 코드와 분리해야 합니다.

**올바른 예:**

```tsx
class Foo {
  myField = 10;

  constructor(private readonly ctorParam) {}

  doThing() {
    console.log(this.ctorParam.getThing() + this.myField);
  }
}
```

**잘못된 예:**

```tsx
class Foo {
  myField = 10;
  constructor(private readonly ctorParam) {}
  doThing() {
    console.log(this.ctorParam.getThing() + this.myField);
  }
}
```

### 4.4.5 클래스 멤버

**#프라이빗 필드 사용 금지**

`#`로 선언되는 프라이빗 필드(Private Identifiers)를 사용하지 마세요:

**잘못된 예:**

```tsx
class Clazz {
  #ident = 1;
}
```

대신, TypeScript의 가시성 제어자(visibility annotations)를 사용하세요:

**올바른 예:**

```tsx
class Clazz {
  private ident = 1;
}
```

**이유:**

- `#` 프라이빗 필드는 TypeScript가 다운레벨링(downleveling) 시 코드 크기와 성능에 큰 영향을 미칩니다.
- ES2015 이전에는 지원되지 않으며, ES2015 이하로 다운레벨링할 수 없습니다.
- 정적 타입 검사로 가시성을 제어할 수 있으므로 `#` 프라이빗 필드의 이점이 크지 않습니다.

---

**`readonly` 사용**

생성자 외부에서 재할당되지 않는 속성은 `readonly`로 표시하세요. 이는 깊이까지 불변일 필요는 없습니다.

---

**매개변수 속성**

명확한 초기화를 클래스 멤버로 전달하는 대신, TypeScript의 매개변수 속성을 사용하세요:

**비효율적 예:**

```tsx
class Foo {
  private readonly barService: BarService;

  constructor(barService: BarService) {
    this.barService = barService;
  }
}
```

**효율적 예:**

```tsx
class Foo {
  constructor(private readonly barService: BarService) {}
}
```

매개변수 속성에 문서화가 필요하면 `@param` JSDoc 태그를 사용하세요.

---

**필드 초기화**

클래스 멤버가 매개변수가 아니라면 선언 시 초기화하세요. 이렇게 하면 생성자를 생략할 수도 있습니다.

**비효율적 예:**

```tsx
class Foo {
  private readonly userList: string[];

  constructor() {
    this.userList = [];
  }
}
```

**효율적 예:**

```tsx
class Foo {
  private readonly userList: string[] = [];
}
```

**팁:**

생성자가 종료된 후 인스턴스에 속성을 추가하거나 제거하지 마세요. 이는 VM이 클래스의 구조(shape)를 최적화하는 데 방해가 됩니다. 나중에 채워질 가능성이 있는 선택적 필드는 `undefined`로 명시적으로 초기화하세요.

---

**클래스 외부에서 사용되는 속성**

Angular 템플릿 등 클래스 외부에서 사용되는 속성은 `private` 가시성을 사용하지 마세요. 적절히 `protected` 또는 `public`을 사용하세요.

- Angular와 AngularJS 템플릿 속성: `protected`
- Polymer 속성: `public`

TypeScript 코드에서 `obj['foo']`를 사용해 속성의 가시성을 우회하지 마세요.

**이유:**

- `private` 속성은 자동화 시스템 및 개발자에게 이 속성이 선언한 클래스의 메서드 내에서만 사용된다는 점을 알립니다.
- `obj['foo']`는 컴파일러의 가시성 제한을 우회할 수 있지만, 빌드 규칙을 재구성하면 동작이 깨질 수 있습니다. 또한, 최적화 호환성을 방해합니다.

---

**게터와 세터**

게터와 세터(접근자)는 사용할 수 있습니다.

- **게터는 순수 함수**여야 합니다(결과가 일관되고 부작용이 없어야 함).
- 내부 구현 세부 사항을 제한적으로 노출할 때 유용합니다.

**올바른 예:**

```tsx
class Foo {
  constructor(private readonly someService: SomeService) {}

  get someMember(): string {
    return this.someService.someVariable;
  }

  set someMember(newValue: string) {
    this.someService.someVariable = newValue;
  }
}
```

**잘못된 예:**

```tsx
class Foo {
  nextId = 0;

  get next() {
    return this.nextId++; // 잘못된 예: 게터가 관찰 가능한 상태를 변경함
  }
}
```

---

**계산된 속성**

계산된 속성은 **심볼(Symbol)**일 때만 사용해야 합니다. 딕셔너리 스타일 속성(따옴표로 감싸거나 계산된 키)은 허용되지 않습니다.

심볼 사용 시 주의: 빌트인 심볼(예: `Symbol.isConcatSpreadable`)은 컴파일러에서 폴리필되지 않으므로, 구형 브라우저에서는 작동하지 않을 수 있습니다.

### 4.4.6 가시성(Visibility)

가시성을 제한하면 코드 간 결합도를 낮추는 데 도움이 됩니다.

**가시성 제한**

속성, 메서드, 전체 타입의 가시성을 가능한 한 제한하세요.

- **비공개 메서드(private methods):**
  비공개 메서드는 같은 파일 내 클래스 외부에 위치한 비-내보낸(non-exported) 함수로 변환하는 것을 고려하세요.
- **비공개 속성(private properties):**
  비공개 속성은 별도의 비-내보낸 클래스(non-exported class)로 이동하는 것을 고려하세요.

---

**TypeScript의 기본 가시성**

TypeScript의 심볼(symbol)은 기본적으로 `public`입니다.

- **`public` 제한자:** `public`은 생성자의 비-읽기 전용 공개 매개변수 속성 선언 시에만 사용하세요. 그 외에는 사용하지 마세요.

---

**잘못된 예:**

`public` 제한자를 불필요하게 사용한 경우:

```tsx
class Foo {
  public bar = new Bar(); // 잘못된 예: public 제한자 불필요

  constructor(public readonly baz: Baz) {} // 잘못된 예: readonly는 기본적으로 public
}
```

**올바른 예:**

불필요한 `public` 제한자를 생략:

```tsx
class Foo {
  bar = new Bar(); // 올바른 예: public 제한자 생략

  constructor(public baz: Baz) {} // 올바른 예: public은 허용됨
}
```

---

**참고: `export` 가시성**

가시성을 제한하는 또 다른 방법으로 `export`를 사용하여 심볼의 가시성을 제어할 수 있습니다.

예를 들어, 필요하지 않은 심볼은 `export`하지 않음으로써 외부 접근을 방지하세요.

### 4.4.7 허용도지 않는 클래스 패턴

**프로토타입 직접 조작 금지**

`class` 키워드를 사용하여 명확하고 읽기 쉬운 클래스 정의를 작성하세요. 프로토타입 속성을 정의하거나 조작하는 것은 일반적인 구현 코드에서 금지됩니다.

- **금지 사항:**
  - 프로토타입 직접 조작
  - 빌트인 객체의 프로토타입 수정
  - 믹스인(Mixin) 패턴 사용

**예외:**

프레임워크 코드(예: Polymer, Angular)는 프로토타입을 사용해야 할 필요가 있을 수 있습니다. 하지만 이 경우에도 프로토타입 사용을 피하기 위해 더 나쁜 대안을 선택하지 마세요.

**잘못된 예:**

```tsx
function MyClass() {}
MyClass.prototype.someMethod = function () {
  return 'bad practice';
};
```

**올바른 예:**

```tsx
class MyClass {
  someMethod() {
    return 'better practice';
  }
}
```

## 4.5 함수

### 4.5.1 용어 정의

다양한 종류의 함수가 있으며, 이들 간에는 미묘한 차이가 있습니다. 이 가이드에서는 [MDN](https://developer.mozilla.org/)의 정의를 따르는 다음 용어를 사용합니다:

1. **함수 선언 (function declaration):**

   `function` 키워드를 사용한 선언으로, 표현식이 아님.

   ```tsx
   function foo() {
     return 42;
   }
   ```

2. **함수 표현식 (function expression):**

   `function` 키워드를 사용하며, 일반적으로 할당문이나 매개변수로 전달되는 표현식.

   ```tsx
   const foo = function () {
     return 42;
   };
   ```

3. **화살표 함수 (arrow function):**

   `=>` 구문을 사용하는 표현식.

   ```tsx
   const foo = () => 42;
   ```

4. **블록 본문 (block body):**

   중괄호(`{}`)를 포함한 화살표 함수의 오른쪽 본문.

   ```tsx
   const foo = () => {
     return 42;
   };
   ```

5. **간결 본문 (concise body):**

   중괄호 없이 단일 식으로 구성된 화살표 함수의 오른쪽 본문.

   ```tsx
   const foo = () => 42;
   ```

**주의:** 메서드(methods) 및 클래스/생성자(constructors)는 이 섹션에서 다루지 않습니다.

### 4.5.2 이름 있는 함수에는 함수 선언 사용 선호

이름 있는 함수를 정의할 때는 **함수 선언(function declaration)**을 선호하세요. 함수 선언은 읽기 쉽고 명확하며, 일반적인 함수 정의에 적합합니다.

**권장 예:**

```tsx
function foo() {
  return 42;
}
```

**비추천 예:**

```tsx
const foo = () => 42; // 화살표 함수 사용
```

---

**화살표 함수 사용**

화살표 함수는 명시적인 타입 주석이 필요할 때나 간단한 표현식에 적합합니다. 특히, 인터페이스를 기반으로 타입을 정의하거나 함수 표현식을 사용해야 할 때 유용합니다.

**예:**

```tsx
interface SearchFunction {
  (source: string, subString: string): boolean;
}

const fooSearch: SearchFunction = (source, subString) => {
  return source.includes(subString);
};
```

**요약**:

- 일반적인 이름 있는 함수는 **함수 선언**을 사용하세요.
- 특별한 타입 정의가 필요한 경우에는 **화살표 함수**를 사용하세요.

### 4.5.3 중첩 함수

**함수 선언 또는 화살표 함수 사용**

메서드나 함수 내부에 중첩된 함수는 **함수 선언** 또는 **화살표 함수**를 적절히 사용할 수 있습니다. 특히 메서드 본문에서는 화살표 함수를 선호합니다. 이는 화살표 함수가 외부 `this`에 접근할 수 있기 때문입니다.

### 4.5.4 함수 표현식 사용 금지

- \*함수 표현식(function expressions)**은 사용하지 마세요. 대신 **화살표 함수\*\*를 사용하세요.

**올바른 예:**

```tsx
bar(() => {
  this.doSomething();
});
```

**잘못된 예:**

```tsx
bar(function () {
  this.doSomething(); // 함수 표현식 사용
});
```

**예외:**

- `this`를 동적으로 다시 바인딩해야 하는 경우(권장하지 않음)
- 제너레이터 함수(화살표 함수로 사용할 수 없음)

### 4.5.5 화살표 함수 본문

화살표 함수는 **간결 본문(concise body)** 또는 **블록 본문(block body)**을 상황에 따라 사용하세요.

**블록 본문 예:**

```tsx
const receipts = books.map((b: Book) => {
  const receipt = payMoney(b.price);
  recordTransaction(receipt);
  return receipt;
});
```

**간결 본문 예:**

```tsx
const longThings = myValues.filter(v => v.length > 1000).map(v => String(v));
```

**간결 본문 사용 규칙**

- 함수의 반환값이 실제로 사용될 때만 간결 본문을 사용하세요.
- 반환값이 사용되지 않으면 블록 본문을 사용해 `void`를 반환하도록 하세요.

**잘못된 예:**

```tsx
myPromise.then(v => console.log(v)); // 반환값이 사용되지 않음
let f: () => void;
f = () => 1; // 반환값이 사용되지 않지만 타입이 void
```

**올바른 예:**

```tsx
myPromise.then(v => {
  console.log(v); // 반환값이 사용되지 않으므로 블록 본문 사용
});

const transformed = [1, 2, 3].map(v => {
  const intermediate = someComplicatedExpr(v);
  const more = acrossManyLines(intermediate);
  return worthWrapping(more);
});

// 명시적 `void`로 반환값 누출 방지
myPromise.then(v => void console.log(v));
```

> 팁:
> `void` 연산자를 사용하면 화살표 함수가 반환값을 사용하지 않을 때 `undefined`를 반환하도록 보장할 수 있습니다.

### 4.5.6 `this` 재바인딩 (Rebinding `this`)

함수 표현식과 함수 선언에서는 특별히 `this` 포인터를 재바인딩하기 위한 목적이 아닌 경우 `this`를 사용하지 않아야 합니다. 대부분의 경우, 화살표 함수나 명시적인 매개변수를 사용하여 `this` 재바인딩을 피할 수 있습니다.

```tsx
function clickHandler() {
  // 나쁨: 이 컨텍스트에서 `this`는 무엇일까요?
  this.textContent = 'Hello';
}

// 나쁨: `this` 포인터 참조가 암묵적으로 `document.body`에 설정됩니다.
document.body.onclick = clickHandler;

// 좋음: 화살표 함수에서 객체를 명시적으로 참조.
document.body.onclick = () => {
  document.body.textContent = 'hello';
};

// 또는: 명시적인 매개변수를 사용
const setTextFn = (e: HTMLElement) => {
  e.textContent = 'hello';
};
document.body.onclick = setTextFn.bind(null, document.body);
```

`this`를 바인딩하기 위해 `f.bind(this)`, `goog.bind(f, this)` 또는 `const self = this` 같은 접근 방식보다는 화살표 함수를 선호하세요.

### 4.5.7 콜백으로 화살표 함수를 전달하는 것을 선호하세요.

콜백은 예상치 못한 인수로 호출될 수 있으며, 이는 타입 검사를 통과하지만 논리적 오류를 초래할 수 있습니다.

명명된 콜백을 고차 함수에 전달하는 것은 두 함수의 호출 시그니처가 안정적임을 확신하지 않는 한 피하세요. 특히, 덜 자주 사용되는 선택적 매개변수에 주의하세요.

```tsx
// 나쁨: 인수가 명시적으로 전달되지 않아 선택적 매개변수 `radix`가
// 배열의 인덱스 0, 1, 2로 전달되면서 의도치 않은 동작이 발생
const numbers = ['11', '5', '10'].map(parseInt);
// > [11, NaN, 2];
```

대신, 명명된 콜백으로 전달할 매개변수를 명시적으로 전달하는 화살표 함수를 사용하세요.

```tsx
// 좋음: 콜백에 인수가 명시적으로 전달됨
const numbers = ['11', '5', '3'].map(n => parseInt(n));
// > [11, 5, 3]

// 좋음: 로컬에서 정의된 함수이며 콜백으로 사용되도록 설계됨
function dayFilter(element: string | null | undefined) {
  return element != null && element.endsWith('day');
}

const days = ['tuesday', undefined, 'juice', 'wednesday'].filter(dayFilter);
```

명시적으로 매개변수를 전달함으로써 의도하지 않은 동작을 예방할 수 있습니다.

### 4.5.8 프로퍼티로 화살표 함수 사용

클래스는 일반적으로 화살표 함수로 초기화된 프로퍼티를 포함하지 않는 것이 좋습니다. 화살표 함수 프로퍼티는 호출하는 함수가 호출 대상의 `this`가 이미 바인딩되었음을 이해해야 하므로, `this`의 의미에 대한 혼란을 증가시킵니다. 이러한 핸들러를 사용하는 호출 위치와 참조는 올바른지 판단하기 위해 비지역적인 정보를 요구하며, 코드 가독성을 떨어뜨릴 수 있습니다.

인스턴스 메서드를 호출할 때는 항상 화살표 함수를 사용해야 하며(`const handler = (x) => { this.listener(x); };`), 인스턴스 메서드에 대한 참조를 직접 얻거나 전달하지 않아야 합니다(`const handler = this.listener; handler(x);`).

> 참고: 특정 상황, 예를 들어 템플릿에서 함수를 바인딩할 때, 화살표 함수를 프로퍼티로 사용하는 것이 더 유용하고 가독성이 높은 경우가 있습니다. 이 규칙은 상황에 따라 적절히 판단하여 적용하세요. 또한, Event Handlers 섹션을 참고하세요.

**잘못된 예시 1: `this`가 콜백에서 유지되지 않는 경우**

```tsx
class DelayHandler {
  constructor() {
    // 문제: 콜백에서 `this`가 유지되지 않음.
    // 콜백의 `this`는 DelayHandler 인스턴스가 아님.
    setTimeout(this.patienceTracker, 5000);
  }
  private patienceTracker() {
    this.waitedPatiently = true;
  }
}
```

**잘못된 예시 2: 화살표 함수를 프로퍼티로 사용**

```tsx
// 화살표 함수는 일반적으로 프로퍼티로 사용하지 않는 것이 좋음.
class DelayHandler {
  constructor() {
    // 나쁨: `this` 바인딩을 잊은 것처럼 보이는 코드
    setTimeout(this.patienceTracker, 5000);
  }
  private patienceTracker = () => {
    this.waitedPatiently = true;
  };
}
```

**올바른 예시: 호출 시점에서 `this`를 명시적으로 관리**

```tsx
class DelayHandler {
  constructor() {
    // 가능하면 익명 함수를 사용
    setTimeout(() => {
      this.patienceTracker();
    }, 5000);
  }
  private patienceTracker() {
    this.waitedPatiently = true;
  }
}
```

---

요약

- 화살표 함수를 프로퍼티로 선언하지 마세요.
- `this`가 필요하면 호출 시점에서 명시적으로 관리하세요.
- 특정 상황에서만 화살표 함수 프로퍼티를 사용하며, 가독성을 고려해 적절히 판단하세요.

### 4.5.9 이벤트 핸들러(Event Handlers)

이벤트 핸들러는 클래스 자체에서 이벤트를 발생시키고 핸들러를 제거할 필요가 없을 때 화살표 함수를 사용할 수 있습니다. 반대로, 핸들러 제거가 필요한 경우에는 `this`를 자동으로 캡처하고 안정적인 참조를 제공하는 화살표 함수 프로퍼티를 사용하는 것이 적합합니다.

```tsx
// 이벤트 핸들러는 익명 함수 또는 화살표 함수 프로퍼티를 사용할 수 있습니다.
class Component {
  onAttached() {
    // 이 클래스에서 이벤트가 발생하므로 제거할 필요 없음
    this.addEventListener('click', () => {
      this.listener();
    });

    // `this.listener`는 안정적인 참조를 제공하므로 나중에 제거할 수 있음
    window.addEventListener('onbeforeunload', this.listener);
  }

  onDetached() {
    // 이벤트는 window에서 발생. 제거하지 않으면 `this.listener`가 `this`에 대한
    // 참조를 유지하여 메모리 누수를 초래할 수 있음.
    window.removeEventListener('onbeforeunload', this.listener);
  }

  // 프로퍼티에 저장된 화살표 함수는 `this`에 자동으로 바인딩됨
  private listener = () => {
    confirm('Do you want to exit the page?');
  };
}
```

주의사항:

- **`bind`를 사용하여 이벤트 핸들러를 설치하지 마세요.** `bind`는 일시적인 참조를 생성하므로 핸들러 제거가 불가능합니다.

```tsx
// `bind`를 사용한 리스너는 제거가 불가능한 참조를 생성
class Component {
  onAttached() {
    // 제거 불가능한 임시 참조를 생성
    window.addEventListener('onbeforeunload', this.listener.bind(this));
  }

  onDetached() {
    // 이 `bind`는 다른 참조를 생성하므로 아무 작업도 수행하지 않음
    window.removeEventListener('onbeforeunload', this.listener.bind(this));
  }

  private listener() {
    confirm('Do you want to exit the page?');
  }
}
```

요약:

- 이벤트 핸들러는 화살표 함수 또는 화살표 함수 프로퍼티로 구현합니다
- bind를 사용하지 마세요

### 4.5.10 매개변수 초기화(Parameter Initializers)

선택적인 함수 매개변수는 인수가 생략되었을 때 사용할 기본값을 설정할 수 있습니다. **초기화에는 관찰 가능한 부작용(side effects)이 없어야 하며**, 가능한 단순하게 유지해야 합니다.

```tsx
typescript
코드 복사
function process(name: string, extraContext: string[] = []) {}
function activate(index = 0) {}

```

나쁜 예시:

1. 전역 상태를 변경하는 초기화:

   ```tsx
   let globalCounter = 0;
   function newId(index = globalCounter++) {}
   ```

2. 공유된 가변 상태를 노출:

   ```tsx
   class Foo {
     private readonly defaultPaths: string[];
     frobnicate(paths = defaultPaths) {}
   }
   ```

권장 사항:

- **기본 매개변수는 간단히 유지**하고 부작용을 피하세요.
- \*구조 분해 할당(destructuring)\*\*을 사용하여 많은 선택적 매개변수가 있을 때 더 읽기 쉬운 API를 만드세요. 선택적 매개변수가 많고 자연스러운 순서가 없는 경우에 유용합니다.

```tsx
function configure({ optionA = true, optionB = 42, optionC = 'default'
```

요약:

- 매개변수 초기화는 부작용이 없어야 하며, 가능한 단순하게 작성합니다.
- 선택저 매개변수가 많을 경우 구조 분해 할당을 사용합니다

### 4.5.11 적절한 경우 `rest`와 `spread` 선호하기

- **`arguments` 대신 `rest` 매개변수 사용**: `arguments`를 직접 사용하는 대신 `rest` 매개변수를 사용하세요. 지역 변수나 매개변수에 `arguments`라는 이름을 사용하는 것을 피하세요. 이는 내장된 이름을 덮어쓰기 때문에 혼란을 초래할 수 있습니다.

```tsx
// 좋음: rest 매개변수 사용
function variadic(array: string[], ...numbers: number[]) {}
```

- **`Function.prototype.apply` 대신 함수 spread 문법 사용**:

```tsx
// 좋음: 함수 spread 문법 사용
myFunction(...args);

// 나쁨: apply 사용
myFunction.apply(null, args);
```

### 4.5.12 함수 포메팅(Formatting functions)

- **함수 본문 시작 및 끝에 빈 줄을 두지 마세요**
- **함수 본문 내에서 빈 줄은 논리적 그룹을 만들 때만 사용**:

  ```tsx
  function process() {
    const data = fetchData();
    validate(data);

    // 논리적으로 다른 작업
    save(data);
  }
  ```

- **제너레이터 함수 및 `yield` 문법**:
  - 제너레이터의 ``는 함수 이름과 `yield` 키워드에 붙여서 작성하세요:
    ```tsx
    function* foo() {
      yield* iter;
    }
    ```
- **화살표 함수의 단일 매개변수**:
  - 단일 매개변수를 사용하는 화살표 함수는 괄호를 권장하지만 필수는 아님:
    ```tsx
    const square = x => x * x; // 권장
    const square = x => x * x; // 허용
    ```
- **`rest`와 `spread` 문법의 `...` 뒤에 공백을 넣지 마세요**:

  ```tsx
  // 나쁨:
  function myFunction(...elements: number[]) {}

  // 좋음:
  function myFunction(...elements: number[]) {}
  ```

## 4.6 this

`this`는 클래스 생성자와 메서드, `this` 타입이 명시적으로 선언된 함수(예: `function func(this: ThisType, ...)`), 또는 `this`를 사용할 수 있는 스코프에 정의된 화살표 함수에서만 사용해야 합니다.

`this`를 전역 객체, `eval`의 컨텍스트, 이벤트의 대상, 또는 불필요하게 `call()`이나 `apply()`로 호출된 함수에서 참조하는 데 사용하지 마세요.

```tsx
this.alert('Hello');
```

## 4.7 Interfaces

## 4.8 Primitive literals

### 4.8.1 문자열 리터럴(String literals)

**싱글 쿼트(single quotes) 사용**

일반 문자열 리터럴은 더블 쿼트(`"`) 대신 싱글 쿼트(`'`)로 구분합니다.

> **Tip**: 문자열에 싱글 쿼트 문자가 포함된 경우, 이를 이스케이프 처리하는 대신 템플릿 문자열을 사용하는 것을 고려하세요.

---

**라인 연속(Line Continuations) 금지**

문자열 리터럴에서 줄 끝에 백슬래시(`\`)를 사용하여 줄바꿈을 하지 마세요. ES5에서 이를 허용하지만, 백슬래시 뒤에 공백이 포함될 경우 예기치 않은 오류를 초래할 수 있으며, 가독성이 떨어질 수 있습니다.

**허용되지 않음:**

```tsx
typescript
코드 복사
const LONG_STRING = 'This is a very very very very very very very long string. \
    It inadvertently contains long stretches of spaces due to how the \
    continued lines are indented.';

```

**대신 이렇게 작성하세요:**

```tsx
typescript
코드 복사
const LONG_STRING = 'This is a very very very very very very long string. ' +
    'It does not contain long stretches of spaces because it uses ' +
    'concatenated strings.';

const SINGLE_STRING =
    'http://it.is.also/acceptable_to_use_a_single_long_string_when_breaking_would_hinder_search_discoverability';

```

---

**템플릿 문자열(Template Literals)**

여러 문자열 리터럴을 포함하는 복잡한 문자열 결합에는 **템플릿 문자열**(백틱(`)으로 구분)을 사용하는 것을 권장합니다. 템플릿 문자열은 여러 줄에 걸쳐 작성할 수 있습니다.

템플릿 문자열이 여러 줄에 걸칠 경우, 포함된 블록의 들여쓰기를 반드시 따라야 하는 것은 아닙니다. 추가 공백이 문제가 되지 않는다면 들여쓰기를 맞춰도 됩니다.

**예시:**

```tsx
typescript
코드 복사
function arithmetic(a: number, b: number) {
  return `Here is a table of arithmetic operations:
${a} + ${b} = ${a + b}
${a} - ${b} = ${a - b}
${a} * ${b} = ${a * b}
${a} / ${b} = ${a / b}`;
}

```

---

**요약**

- 일반 문자열 리터럴에는 **싱글 쿼트**를 사용하세요.
- **백슬래시(`\`)로 줄을 이어 쓰는 방식은 피하세요.** 대신 문자열 결합이나 템플릿 문자열을 사용하세요.
- 복잡한 문자열 결합에는 **템플릿 문자열**을 선호하세요.

### **4.8.2 숫자 리터럴(Number Literals)**

숫자는 10진수, 16진수, 8진수, 또는 2진수로 지정할 수 있습니다. **16진수, 8진수, 2진수는 각각 정확히 `0x`, `0o`, `0b` 접두사를 사용**하고, 소문자 접두사를 사용하세요.

**0**으로 시작하는 숫자는 **x, o, b**가 바로 뒤에 오는 경우를 제외하고는 사용하지 마세요.

### **4.8.3 타입 강제 변환(Type Coercion)**

**`String()`과 `Boolean()` 함수 사용**

TypeScript 코드에서는 `String()`과 `Boolean()`(주의: `new` 없이 사용)을 사용하거나, 문자열 템플릿 리터럴 또는 `!!`을 사용하여 타입을 강제 변환할 수 있습니다.

```tsx
typescript
코드 복사
const bool = Boolean(false);
const str = String(aNumber);
const bool2 = !!str;
const str2 = `result: ${bool2}`;

```

**열거형(enum) 타입 변환**

열거형 타입의 값(또는 열거형 타입과 다른 타입의 유니언)은 `Boolean()`이나 `!!`를 사용해 변환하면 안 됩니다. 대신 비교 연산자를 사용해 명시적으로 비교해야 합니다.

**잘못된 예:**

```tsx
typescript
코드 복사
enum SupportLevel {
  NONE,
  BASIC,
  ADVANCED,
}

const level: SupportLevel = ...;
let enabled = Boolean(level);

const maybeLevel: SupportLevel | undefined = ...;
enabled = !!maybeLevel;

```

**올바른 예:**

```tsx
typescript
코드 복사
enum SupportLevel {
  NONE,
  BASIC,
  ADVANCED,
}

const level: SupportLevel = ...;
let enabled = level !== SupportLevel.NONE;

const maybeLevel: SupportLevel | undefined = ...;
enabled = level !== undefined && level !== SupportLevel.NONE;

```

**이유**: 대부분의 경우 열거형 이름이 런타임에서 어떤 숫자 또는 문자열 값과 매핑되었는지는 중요하지 않습니다. 개발자들은 주로 열거형 값을 이름으로 참조하기 때문에, 매핑된 값에 의존해야 하는 경우는 예상치 못한 동작을 초래할 수 있습니다. 특히 열거형의 첫 번째 값은 기본적으로 `0`이므로 `falsy`로 평가되고, 다른 값들은 `truthy`로 평가되어 혼란을 줄 수 있습니다.

---

**숫자 변환**

- 문자열을 숫자로 변환하려면 **`Number()`를 사용**해야 하며, 반환값이 `NaN`인지 명시적으로 확인해야 합니다. 단, 문맥상 변환 실패가 불가능한 경우는 예외입니다.
- **`+` 단항 연산자**를 사용해 문자열을 숫자로 변환하지 마세요. 단항 연산자는 코드 리뷰에서 놓치기 쉽고, 의도하지 않은 동작을 초래할 수 있습니다.

```tsx
// 나쁨: 단항 연산자로 숫자 변환
const x = +y;

// 좋음: Number()와 검증
const aNumber = Number('123');
if (!isFinite(aNumber)) throw new Error(...);

```

- `parseInt`와 `parseFloat`는 **10진수가 아닌 문자열**을 처리하는 경우를 제외하고 사용하지 마세요. 이 함수들은 문자열의 끝에 있는 불필요한 문자를 무시하므로, 오류 상황을 감출 가능성이 있습니다.

```tsx
// 나쁨: 의도치 않은 결과 가능
const n = parseInt(someString, 10);
const f = parseFloat(someString);

// 16진수 처리 시만 허용
if (!/^[a-fA-F0-9]+$/.test(someString)) throw new Error(...);
const n = parseInt(someString, 16);

```

- 정수를 파싱하려면 \**`Number()`와 `Math.floor` 또는 `Math.trunc`*를 사용하세요.

```tsx
let f = Number(someString);
if (isNaN(f)) handleError();
f = Math.floor(f);
```

---

**암묵적 강제 변환(Implicit Coercion)**

조건문(`if`, `for`, `while`)에서 암묵적 불리언 강제 변환이 가능한 경우, 명시적인 강제 변환을 사용하지 마세요.

```tsx
// 나쁨: 명시적으로 불리언 변환
const foo: MyInterface | null = ...;
if (!!foo) {...}
while (!!foo) {...}

// 좋음: 암묵적 강제 변환
if (foo) {...}
while (foo) {...}

```

열거형 타입도 암묵적으로 불리언으로 변환하지 말고, 명시적으로 비교 연산자를 사용해야 합니다.

```tsx
enum SupportLevel {
  NONE,
  BASIC,
  ADVANCED,
}

const level: SupportLevel = ...;
if (level !== SupportLevel.NONE) {...}

const maybeLevel: SupportLevel | undefined = ...;
if (level !== undefined && level !== SupportLevel.NONE) {...}

```

---

**다른 값의 암묵적 강제 변환**

열거형이 아닌 다른 값은 암묵적 불리언 강제 변환 또는 명시적인 비교 연산자를 사용할 수 있습니다.

```tsx
// 명시적 비교
if (arr.length > 0) {...}

// 암묵적 강제 변환
if (arr.length) {...}

```

## 4.9 제어 구조(Control Structures)

### 4.9.1 제어 흐름 문과 블록

제어 흐름 문(`if`, `else`, `for`, `do`, `while` 등)은 항상 중괄호 블록을 사용해야 하며, 블록의 내용이 단일 문장만 포함하더라도 적용됩니다. 비어 있지 않은 블록의 첫 번째 문장은 반드시 새 줄에서 시작해야 합니다.

**올바른 예:**

```tsx
for (let i = 0; i < x; i++) {
  doSomethingWith(i);
}

if (x) {
  doSomethingWithALongMethodNameThatForcesANewLine(x);
}
```

**잘못된 예:**

```tsx
if (x) doSomethingWithALongMethodNameThatForcesANewLine(x);

for (let i = 0; i < x; i++) doSomethingWith(i);
```

**예외:**

- 한 줄로 작성할 수 있는 `if` 문은 블록을 생략할 수 있습니다.

```tsx
if (x) x.doFoo();
```

---

**제어문 내 변수 할당**

제어문 내부에서 변수 할당은 피하는 것이 좋습니다. 이는 할당이 동등성 비교로 쉽게 오인될 수 있기 때문입니다.

**잘못된 예:**

```tsx
if ((x = someFunction())) {
  // 할당이 동등성 비교로 오인될 수 있음
}
```

**올바른 예:**

```tsx
x = someFunction();
if (x) {
  // ...
}
```

**할당이 필요한 경우:**
제어문 내에서 변수 할당이 반드시 필요한 경우, 의도적으로 수행된 것임을 나타내기 위해 추가 괄호를 사용하세요.

```tsx
while ((x = someFunction())) {
  // 추가 괄호로 의도적임을 명확히 표현
}
```

---

**컨테이너 순회**

배열을 순회할 때는 **`for (... of someArr)`**를 선호합니다. `Array.prototype.forEach`나 일반 `for` 루프도 허용됩니다.

**배열 순회 예시:**

```tsx
for (const x of someArr) {
  // x는 someArr의 값입니다.
}

for (let i = 0; i < someArr.length; i++) {
  // 인덱스가 필요한 경우 명시적으로 카운트
  const x = someArr[i];
}

for (const [i, x] of someArr.entries()) {
  // 위와 동일한 방식의 대안
}
```

**`for-in` 사용 금지:**`for (... in ...)`은 배열 순회에 사용하지 마세요. 이는 배열의 값을 반환하지 않고, 인덱스(문자열!)를 반환하기 때문입니다.

```tsx
for (const x in someArray) {
  // x는 배열의 인덱스입니다!
}
```

---

**`for-in` 사용 규칙**

`for-in`은 딕셔너리 스타일 객체에만 사용해야 합니다. **`Object.prototype.hasOwnProperty`**를 사용하여 원치 않는 프로토타입 속성을 제외하세요. 가능하다면, **`Object.keys`**, **`Object.values`**, 또는 **`Object.entries`**와 함께 `for-of`를 선호합니다.

**`for-in` 예:**

```tsx
for (const key in obj) {
  if (!obj.hasOwnProperty(key)) continue;
  doWork(key, obj[key]);
}
```

**`for-of` 예:**

```tsx
for (const key of Object.keys(obj)) {
  doWork(key, obj[key]);
}

for (const value of Object.values(obj)) {
  doWorkValOnly(value);
}

for (const [key, value] of Object.entries(obj)) {
  doWork(key, value);
}
```

### **4.9.2 그룹화 괄호(Grouping Parentheses)**

선택적인 그룹화 괄호는 작성자와 리뷰어가 괄호 없이도 코드가 오해될 가능성이 없으며, 괄호가 코드의 가독성을 높이지 않는다고 동의하는 경우에만 생략됩니다. 모든 독자가 연산자 우선순위 테이블을 완벽히 기억한다고 가정해서는 안 됩니다.

**주의:**`delete`, `typeof`, `void`, `return`, `throw`, `case`, `in`, `of`, `yield` 뒤의 전체 표현식을 괄호로 감싸는 것은 불필요하므로 사용하지 마세요.

### **4.9.3 예외 처리(Exception Handling)**

예외는 언어의 중요한 부분이며, 예외적인 상황이 발생할 때 사용해야 합니다.

**사용자 정의 예외(Custom Exceptions)**

기본 `Error` 타입으로는 부족할 경우, 사용자 정의 예외를 정의하고 사용하는 것이 좋습니다. 사용자 정의 예외는 함수에서 추가적인 오류 정보를 전달하는 데 유용합니다.

**예외를 던질 때는 예외 객체를 사용**

즉석에서 오류를 처리하는 방식(예: 오류 컨테이너 참조 타입 전달, `error` 속성이 포함된 객체 반환) 대신 예외를 던지는 방식을 선호하세요.

**`new` 키워드를 사용하여 예외 생성**

예외를 인스턴스화할 때는 항상 `new Error()`를 사용하세요. `new` 없이 호출해도 동일한 `Error` 인스턴스가 생성되지만, 다른 객체 생성 방식과 일관성을 유지하기 위해 `new`를 사용하는 것이 좋습니다.

```tsx
// 올바른 예:
throw new Error('Foo is not a valid bar.');

// 잘못된 예:
throw Error('Foo is not a valid bar.');
```

**예외 객체만 던지기**

JavaScript와 TypeScript는 임의의 값을 예외로 던지거나 `Promise`를 거절할 수 있지만, `Error`가 아닌 값을 던질 경우 스택 추적 정보가 없어 디버깅이 어려워집니다.

```tsx
// 잘못된 예:
throw 'oh noes!';
Promise.reject('oh noes!');

// 올바른 예:
throw new Error('oh noes!');
Promise.reject(new Error('oh noes!'));
```

**서브클래스를 활용한 예외 처리**

```tsx
class MyError extends Error {}
throw new MyError('my oh noes!');
Promise.reject(new MyError('oh noes!'));
```

---

**예외 잡기 및 다시 던지기(Catching and Rethrowing)**

예외를 잡을 때, 모든 예외는 `Error`의 인스턴스라고 가정해야 합니다.

```tsx
function assertIsError(e: unknown): asserts e is Error {
  if (!(e instanceof Error)) throw new Error('e is not an Error');
}

try {
  doSomething();
} catch (e: unknown) {
  assertIsError(e);
  displayError(e.message);
  throw e; // 다시 던지기
}
```

**특수한 경우: `Error`가 아닌 값을 던지는 API**

`Error`가 아닌 값을 던지는 API를 사용하는 경우, 명확히 주석으로 설명하고 필요한 경우 방어적으로 처리합니다.

```tsx
try {
  badApiThrowingStrings();
} catch (e: unknown) {
  // 주의: 이 API는 문자열을 던집니다.
  if (typeof e === 'string') {
    handleStringError(e);
  }
}
```

**이유:**

과도하게 방어적인 프로그래밍을 피하세요. 대부분의 코드에서 발생하지 않는 문제를 방어하려는 반복적인 코드는 쓸모없는 보일러플레이트 코드를 유발할 수 있습니다.

---

**빈 `catch` 블록**

예외를 잡았을 때 아무런 조치를 취하지 않는 것은 거의 옳지 않습니다. 만약 `catch` 블록에서 아무 행동도 하지 않아야 하는 상황이라면, 이를 정당화하는 이유를 주석으로 설명해야 합니다.

**올바른 예:**

```tsx
try {
  return handleNumericResponse(response);
} catch (e: unknown) {
  // 응답이 숫자가 아닙니다. 텍스트로 처리합니다.
}
return handleTextResponse(response);
```

**잘못된 예:**

```tsx
try {
  shouldFail();
  fail('expected an error');
} catch (expected: unknown) {}
```

> Tip: 위와 같은 패턴은 fail에서 던져진 오류를 잡기 때문에 올바르게 동작하지 않습니다. 대신 assertThrows()를 사용하세요.

### **4.9.4 `switch` 문**

**기본(default) 구문 포함**

모든 `switch` 문에는 기본(`default`) 구문이 포함되어야 하며, 이 구문은 코드가 없어도 반드시 작성해야 합니다. 기본 구문은 항상 마지막에 위치해야 합니다.

```tsx
switch (x) {
  case Y:
    doSomethingElse();
    break;
  default:
  // 처리할 내용이 없음.
}
```

---

**`switch` 블록 내의 종료 규칙**

`switch` 블록 내의 각 구문 그룹은 반드시 `break`, `return` 또는 예외를 던지는 방식으로 명시적으로 종료해야 합니다. 빈 구문이 아닌 구문 그룹은 절대로 암묵적으로 다음 구문으로 넘어가면 안 됩니다. (컴파일러에서 이를 강제함)

**잘못된 예:**

```tsx
switch (x) {
  case X:
    doSomething();
  // 다음으로 넘어감 - 허용되지 않음!
  case Y:
  // ...
}
```

**빈 구문 그룹의 예외**

빈 구문 그룹은 다음 구문으로 넘어가는 것이 허용됩니다.

**올바른 예:**

```tsx
switch (x) {
  case X:
  case Y:
    doSomething();
    break;
  default: // 처리할 내용이 없음.
}
```

### **4.9.5 동등성 검사(Equality Checks)**

**`===` 및 `!==` 사용**

항상 **삼중 등호(`===`)**와 **삼중 부등호(`!==`)**를 사용해야 합니다. 이중 등호(`==`, `!=`)는 타입 강제 변환이 발생하며, 이는 이해하기 어렵고 자바스크립트 가상 머신(JVM)에서 구현 속도도 느립니다.

**잘못된 예:**

```tsx
if (foo == 'bar' || baz != bam) {
  // 타입 강제 변환으로 인해 동작을 이해하기 어려움.
}
```

**올바른 예:**

```tsx
if (foo === 'bar' || baz !== bam) {
  // 명확하고 안전함.
}
```

---

### **예외: `null` 비교**

리터럴 값 `null`과의 비교에서는 이중 등호(`==`, `!=`)를 사용할 수 있습니다. 이를 통해 `null`과 `undefined` 모두를 검사할 수 있습니다.

**예:**

```tsx
if (foo == null) {
  // foo가 null 또는 undefined일 때 동작.
}
```

### **4.9.6 타입 및 널 불가(assertions)**

**타입 단언(`as`)과 널 불가 단언(`!`)**

타입 단언(`x as SomeType`)과 널 불가 단언(`y!`)은 안전하지 않습니다. 이 두 방식은 TypeScript 컴파일러의 오류를 무시하게 하지만, 런타임에서 이러한 단언을 보장하는 검사를 삽입하지 않으므로 프로그램이 런타임에 충돌할 수 있습니다.

이 때문에 명확하거나 명시적인 이유가 없으면 타입 단언과 널 불가 단언을 사용하지 않아야 합니다.

**잘못된 예:**

```tsx
(x as Foo).foo();

y!.bar();
```

**런타임 검사를 권장**

타입이나 널 불가를 단언하려면, 이를 검증하는 명시적인 런타임 검사를 작성하는 것이 가장 좋습니다.

```tsx
// Foo가 클래스라고 가정
if (x instanceof Foo) {
  x.foo();
}

if (y) {
  y.bar();
}
```

**단언이 안전한 경우 설명 추가**

코드의 특정 속성 때문에 단언이 안전하다고 확신할 수 있다면, 왜 해당 단언이 안전한지 명확히 설명하는 주석을 추가하세요.

```tsx
typescript
코드 복사
// x는 Foo임. 이유는...
(x as Foo).foo();

// y는 null일 수 없음. 이유는...
y!.bar();

```

**주석이 불필요한 경우**

단언의 이유가 코드의 문맥상 명확하다면 주석을 생략할 수 있습니다. 예를 들어, 생성된 프로토코드가 항상 nullable이지만, 백엔드에서 특정 필드가 항상 제공된다는 점이 잘 알려져 있는 경우입니다. 상황에 따라 판단하세요.

---

**타입 단언 구문**

타입 단언은 반드시 `as` 문법을 사용해야 하며, **꺾쇠 괄호 문법(<>)**은 사용하지 않습니다. 이는 멤버에 접근할 때 단언 주위에 괄호를 강제합니다.

**잘못된 예:**

```tsx
const x = (<Foo>z).length;
const y = <Foo>z.length;

```

**올바른 예:**

```tsx
// z는 Foo임. 이유는...
const x = (z as Foo).length;
```

---

**이중 단언(Double Assertions)**

TypeScript 핸드북에 따르면, TypeScript는 타입 간의 변환이 더 구체적이거나 덜 구체적일 때만 타입 단언을 허용합니다. 이러한 조건을 충족하지 않는 단언(`x as Foo`)은 다음과 같은 오류를 발생시킵니다:

> "타입 'X'를 'Y'로 변환하는 것은 두 타입 간에 충분히 겹치지 않기 때문에 실수일 수 있습니다."

단언이 안전하다고 확신할 수 있다면, **이중 단언**을 사용할 수 있습니다. 이중 단언은 `unknown`을 중간 타입으로 사용하여 수행합니다. `unknown`은 모든 타입보다 덜 구체적입니다.

```tsx
// x는 Foo임. 이유는...
(x as unknown as Foo).fooMethod();
```

> 주의: 중간 타입으로는 any나 {} 대신 unknown을 사용하세요.

---

**타입 단언과 객체 리터럴**

객체 리터럴의 타입을 지정할 때, **타입 단언(`as Foo`) 대신 타입 주석(`: Foo`)을 사용**하세요. 이렇게 하면 인터페이스 필드가 변경될 때 리팩토링 오류를 감지할 수 있습니다.

**잘못된 예:**

```tsx
interface Foo {
  bar: number;
  baz?: string; // 필드가 나중에 "bam"에서 "baz"로 변경됨.
}

const foo = {
  bar: 123,
  bam: 'abc', // 오류가 발생하지 않음!
} as Foo;

function func() {
  return {
    bar: 123,
    bam: 'abc', // 오류가 발생하지 않음!
  } as Foo;
}
```

**올바른 예:**

```tsx
interface Foo {
  bar: number;
  baz?: string; // 필드가 "bam"에서 "baz"로 변경됨.
}

const foo: Foo = {
  bar: 123,
  bam: 'abc', // "bam"이 Foo에 정의되지 않았다고 오류 발생.
};

function func(): Foo {
  return {
    bar: 123,
    bam: 'abc', // "bam"이 Foo에 정의되지 않았다고 오류 발생.
  };
}
```

### **4.9.7 `try` 블록을 간결하게 유지**

`try` 블록 내부의 코드는 가능하다면 가독성을 해치지 않는 범위 내에서 최소화하세요.

**예시 1: 간결한 `try` 블록**

```tsx
typescript
코드 복사
try {
  const result = methodThatMayThrow();
  use(result);
} catch (error: unknown) {
  // ...
}

```

**예시 2: 던지지 않는 코드는 `try` 블록 밖으로 이동**

```tsx
typescript
코드 복사
let result;
try {
  result = methodThatMayThrow();
} catch (error: unknown) {
  // ...
}
use(result);

```

`try/catch` 블록 밖으로 예외를 던지지 않는 코드를 이동하면, 어떤 메서드가 예외를 던질 수 있는지 독자가 더 쉽게 이해할 수 있습니다. 다만, 예외를 던지지 않는 인라인 호출이 임시 변수로 인해 코드가 복잡해질 경우, `try` 블록 안에 남겨둘 수 있습니다.

**예외: 루프 내부의 `try` 블록**

루프 안에서 `try` 블록을 사용하는 경우 성능 문제가 발생할 수 있습니다. 이럴 때는 루프 전체를 포함하도록 `try` 블록을 확장해도 괜찮습니다.

## **4.10 데코레이터(Decorators)**

**데코레이터 정의**

데코레이터는 `@` 접두사를 사용하는 문법입니다(예: `@MyDecorator`).

**새로운 데코레이터 정의 금지**

프레임워크에서 제공하는 데코레이터만 사용하세요.

**허용되는 데코레이터 예시:**

- Angular (`@Component`, `@NgModule` 등)
- Polymer (`@property` 등)

**이유**

데코레이터는 실험적 기능으로 도입되었지만, 이후 TC39 제안과 달라졌으며 수정되지 않는 알려진 버그가 존재합니다. 따라서 데코레이터 사용은 일반적으로 지양합니다.

---

**데코레이터 스타일**

데코레이터는 장식할 대상 바로 앞에 작성되어야 하며, 그 사이에 빈 줄이 없어야 합니다.

```tsx
typescript
코드 복사
/** JSDoc 주석은 데코레이터 앞에 위치 */
@Component({...})  // 주의: 데코레이터 뒤에 빈 줄 없음.
class MyComp {
  @Input() myField: string;  // 필드의 데코레이터는 같은 줄에 위치할 수 있음.

  @Input()
  myOtherField: string;  // 또는 다음 줄로 감쌀 수 있음.
}

```

## **4.11 금지된 기능(Disallowed Features)**

### **4.11.1 기본 자료형의 래퍼 객체**

TypeScript 코드에서 `String`, `Boolean`, `Number`와 같은 기본 자료형의 래퍼 클래스를 인스턴스화하지 마세요. 이러한 래퍼 클래스는 예상치 못한 동작을 유발할 수 있습니다. 예를 들어, `new Boolean(false)`는 `true`로 평가됩니다.

**잘못된 예:**

```tsx
typescript
코드 복사
const s = new String('hello');
const b = new Boolean(false);
const n = new Number(5);

```

**권장 사항:**

래퍼 클래스는 타입 강제 변환이나 심볼 생성에 호출 함수로 사용할 수 있습니다. 자세한 내용은 **타입 강제 변환(Type Coercion)** 섹션을 참고하세요.

---

### **4.11.2 자동 세미콜론 삽입(Automatic Semicolon Insertion, ASI)**

**ASI에 의존하지 말고 모든 문장을 세미콜론(;)으로 명시적으로 종료하세요.**

명시적으로 세미콜론을 사용하면 잘못된 세미콜론 삽입으로 인한 버그를 방지하고, ASI 지원이 제한적인 도구(e.g., `clang-format`)와의 호환성을 보장할 수 있습니다.

---

### **4.11.3 `const enum` 사용 금지**

코드에서 **`const enum`을 사용하지 말고 일반 `enum`을 사용**하세요.

**이유:**
TypeScript의 `enum`은 이미 수정할 수 없습니다.

`const enum`은 모듈의 JavaScript 사용자에게 열거형을 숨기기 위한 최적화와 관련된 별도의 언어 기능입니다. 일반적으로 사용하지 않는 것이 좋습니다.

---

### **4.11.4 `debugger` 문**

`debugger` 문은 **프로덕션 코드에서 포함되지 않아야 합니다.**

**잘못된 예:**

```tsx
function debugMe() {
  debugger;
}
```

---

### **4.11.5 `with` 키워드**

**`with` 키워드는 사용하지 마세요.**

이 키워드는 코드의 이해를 어렵게 만들며, ES5부터 **strict mode**에서 금지되었습니다.

---

### **4.11.6 동적 코드 평가(Dynamic Code Evaluation)**

`eval` 또는 `Function(...string)` 생성자는 사용하지 마세요.

이러한 기능은 잠재적으로 위험하며, 엄격한 콘텐츠 보안 정책(Content Security Policies)을 사용하는 환경에서 작동하지 않습니다.

---

### **4.11.7 비표준 기능(Non-standard Features)**

다음에 해당하는 비표준 기능을 사용하지 마세요:

- **구식 기능**: ECMAScript 또는 웹 플랫폼에서 더 이상 사용되지 않거나 제거된 기능 (MDN 참고)
- **표준화되지 않은 새로운 ECMAScript 기능**: 아직 ECMA-262 사양에 포함되지 않은 기능
- **제안 상태의 기능**: TC39 작업 초안 단계에 있거나 현재 제안 과정에 있는 기능

**사용해야 할 기능:**

- 현재 ECMA-262 사양에 정의된 ECMAScript 기능만 사용하세요.

**표준화되지 않은 웹 표준의 예:**

- WHATWG 제안서 중 아직 제안 과정을 완료하지 않은 기능
- 외부 트랜스파일러가 제공하는 비표준 언어 "확장"

---

**특정 JavaScript 런타임을 대상으로 한 프로젝트**

`latest-Chrome-only`, Chrome 확장 프로그램, Node.js, Electron 등 특정 JavaScript 런타임을 대상으로 하는 프로젝트는 해당 런타임의 API를 사용할 수 있습니다.

그러나 특정 브라우저에서만 구현된 **독점적인 API**를 사용할 때는 주의하세요.

가능하다면, 이 API를 추상화할 수 있는 **공통 라이브러리**가 있는지 고려하세요.

### **4.11.8 내장 객체 수정 금지**

1.  **내장 타입 수정 금지**
    내장 타입의 생성자 또는 프로토타입에 메서드를 추가하지 마세요.
    이를 수행하는 라이브러리에도 의존하지 마세요.
2.  **전역 객체에 심볼 추가 금지**
    반드시 필요한 경우(예: 서드파티 API 요구 사항) 외에는 전역 객체에 심볼을 추가하지 마세요.

---

# 5. 네이밍

## 5.1 식별자

- 모든 식별자는 아스키 문자와 숫자, 언더바 (상수나 테스트 메소드명과 같은 경우들), ‘$’ 기호로 이루어진다.

### 5.1.1 네이밍 스타일

- TypeScript는 type에도 정보를 표현하므로 이름들에는 type에도 있는 정보를 중복해선 안된다.
  - 언더바를 이름의 시작과 끝에 두지 않는다. (_score, score_ 등)
  - opt\_ 수식어를 optional parameter에 쓰지 않는다.
  - 해당 인터페이스가 관용적이지 않으면 인터페이스를 특별하게 네이밍하지 않는다. (예시 - MyFooInterface) 인터페이스의 이름은 인터페이스의 역할을 설명하게끔 한다. (예시 - class TodoItem의 인터페이스 TodoItemStorage)
  - Observable에는 $의 수식어를 붙인다. ($observable) 해당 규칙은 observable value와 concrete value 간의 혼동을 줄일 수 있다.

### 5.1.2 설명적인 이름

- 모든 이름은 다른 사람(본인 팀 외의 인원들)도 이해할 수 있게 설명적이어야 한다. 약속되지 않고 이해하기 힘든 줄임말은 없어야 하고, 줄임말을 만들 때 한 단어에서 철자를 빼서 만들지 않는다.

  ```jsx
  // Good identifiers:
  errorCount; // 줄임말 없음
  dnsConnectionIndex; // DNS의 의미는 통용되므로 사용
  referrerUrl; // URL과 같은 의미
  customerId; // Id는 쉽게 이해할 수 있다.

  // Disallowed identifiers:
  n; // ? 의미없음.
  nErr; // 모호한 줄임말
  nCompConns; // 모호한 줄임말
  wgcConnections; // 본인 팀만 이 이름의 의미를 알 수 있다.
  pcReader; // pc로 줄임말이 되는 것이 너무 많다.
  cstmrId; // 단어 안의 철자를 없애서 줄임말을 만듦
  kSecondsPerDay; // 헝가리언 notation 사용 금지
  customerID; // Id의 Camel case형식이 잘못됨.
  ```

### 5.1.3 Camel case

- HTTP와 같은 단어도 변수명에서 하나의 단어로 취급한다. 단, 플랫폼 이름에 필요하다면 허용한다.
  - ex) loadHttpUrl O, loadHTTPURL X
  - XMLHttpRequest O

## 5.2 식별자 타입에 따른 규칙

- 모든 식별자는 종류에 따라 다음과 같은 형식을 취한다.

| 스타일         | 카테고리                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------- |
| UpperCamelCase | 클래스, 인터페이스, 타입, enum, type parameter, decorator, TSX 함수, JSXElement type parameter |
| lowerCamelCase | 변수, 일반 매개변수, 함수, 메소드, property, module alias                                      |
| CONSTANT_CASE  | 글로벌 상수(enum 값도 포함)                                                                    |
| #ident         | private 식별자는 사용하지 않는다.                                                              |

### 5.2.1 타입 매개변수

- Array<T>의 타입 매개변수와 같은 경우 대문자 한개(T) 또는 UpperCamelCase로 형식을 지정한다.

### 5.2.2 테스트용 이름

- xUnit 스타일 테스트 프레임워크의 메소드 이름은 \_ 구분기호로 지을 수 있다.
  - ex) testX_whenY_doesZ()

### 5.2.3 접두사/접미사

- \_는 접두사/접미사로 사용하지 않는다.
- \_는 단독으로 식별자로 이용되지 않는다.

### 5.2.4 import

- 모듈을 가져올 때 namespace는 lowerCamelCase로 가져오고, 파일명 형식은 snake_case이다.
  ```jsx
  import * as fooBar from './foo_bar';
  ```
- 예외적으로 일부 라이브러리는 이러한 namespace를 사용하지 않는다. (jqeury, threejs)

### 5.2.5 상수

- CONSTANT_CASE는 고정이 되는 상수값이나, 사용자가 개입해서는 안되는 값이다.
  ```jsx
  const UNIT_SUFFIXES = {
    milliseconds: 'ms',
    seconds: 's',
  };
  // Even though per the rules of JavaScript UNIT_SUFFIXES is
  // mutable, the uppercase shows users to not modify it.
  ```
- 클래스의 static readonly 값도 상수이다.

  ```jsx
  class Foo {
    private static readonly MY_SPECIAL_NUMBER = 5;

    bar() {
      return 2 * Foo.MY_SPECIAL_NUMBER;
    }
  }
  ```

- 전역 심볼: 모듈 단위에서 선언된 심볼과 모듈 단위 클래스의 static 필드, 모듈 단위 enum의 값만 CONSTANT_CASE를 사용한다. 값이 프로그램 실행 중 여러 번 인스턴스화된다면 lowerCamelCase를 사용한다. (함수 내에서 선언된 지역 변수 등)
- 인터페이스를 상속받는 arrow 함수인 경우, lowerCamelCase를 사용할 수 있다.

### 5.2.6 별칭(alias)

- 기존 심볼의 로컬 범위 별칭을 생성할 때는 기존 식별자의 형식을 사용한다. 로컬 별칭은 소스의 기존 명명 및 형식과 일치한다. `const` 변수의 경우 로컬 별칭에 사용하고 클래스 필드의 경우 `readonly`속성을 사용한다.

  ```jsx
  const {BrewStateEnum} = SomeType;
  const CAPACITY = 5;

  class Teapot {
    readonly BrewStateEnum = BrewStateEnum;
    readonly CAPACITY = CAPACITY;
  }
  ```

---

# 6. 타입 시스템

## 6.1 타입 추론

- 코드는 모든 유형 표현식(변수, 필드, 반환 유형 등)에 대해 TypeScript 컴파일러가 구현한 유형 추론에 의존 할 수 있다.
  ```tsx
  const x = 15; // Type inferred.
  ```
- 변수나 매개변수가 string, number, boolean, ReqExp, new 와 같은 것으로 초기화된다면 타입 주석을 생략한다. (쉽게 추론 가능한 경우)

  ```tsx
  const x: boolean = true; // Bad: 'boolean' here does not aid readability

  // Bad: 'Set' is trivially inferred from the initialization
  const x: Set<string> = new Set();
  ```

- 제네릭 타입 매개변수가 unknown으로 오인받지 않으려면 명시적으로 타입을 나타내줘야 한다. 비어있는 배열, 객체, Map, Set과 같은 값을 선언할 때 적용된다.
  ```tsx
  const x = new Set<string>();
  ```
- 복잡한 표현식에 대해서는 타입 주석을 추가하여 가독성을 높인다.

  ```tsx
  // Hard to reason about the type of 'value' without an annotation.
  const value = await rpc.getSomeValue().transform();

  // Can tell the type of 'value' at a glance.
  const value: string[] = await rpc.getSomeValue().transform();
  ```

- 주석이 필요한지는 코드의 리뷰어들이 정한다.

### 6.1.1 return 타입

- 함수와 메서드에 대한 반환 유형 주석을 포함할지 여부는 코드 작성자에게 달려 있습니다. 검토자는 이해하기 어려운 복잡한 반환 유형을 명확히 하기 위한 주석을 요청할 *수 있습니다 . 프로젝트는 항상 반환 유형을 요구하는 로컬 정책을 가질 수 있지만* , 이는 일반적인 TypeScript 스타일 요구 사항은 아닙니다.
- 명시적으로 return 값을 입력하면 두 가지 이점이 있다.
  - 더 나은 가독성
  - 함수의 return 타입을 변경하는 코드 변경이 있는 경우 오류를 더 빠르게 찾을 수 있다.

## 6.2 undefined와 null

- Nullable 타입은 유니온 타입으로 정의 될 수 있다(string|null). undefined도 마찬가지.
- 값이 비어있는 상태를 나타낼 때, undefined나 null을 둘 다 사용할 수 있다. JavaScript API는 보통 undefined를 사용하고, DOM과 구글 API는 null을 사용한다. 따라서 경우에 따라 필요한 것을 사용하면 된다.

### 6.2.1 nullable/undefined 타입 alias

- 타입 alias는 |null과 |undefined를 넣지 않는다. 실제로 alias가 사용될 때에만 |null 과 |undefined를 쓴다.

  ```tsx
  // Bad
  type CoffeeResponse = Latte|Americano|undefined;

  class CoffeeService {
    getLatte(): CoffeeResponse { ... };
  }

  // Better
  type CoffeeResponse = Latte|Americano;

  class CoffeeService {
    getLatte(): CoffeeResponse|undefined { ... };
  }
  ```

### 6.2.2 |undefined 대신 optional 사용

- TypeScript에서는 ?:을 사용하여 optional parameter를 사용할 수 있다.

  ```tsx
  interface CoffeeOrder {
    sugarCubes: number;
    milk?: Whole|LowFat|HalfHalf;
  }

  function pourCoffee(volume?: Milliliter) { ... }
  ```

- Optional parameter는 |undefined를 내장하고 있다.
- 따라서 optional 필드와 parameter를 사용한다.
- 클래스 내부의 필드인 경우, 이러한 것들을 최소화하고 최대한 많은 필드를 초기화하여 선언한다.
  ```tsx
  class MyClass {
    field = '';
  }
  ```

## 6.3 구조적인 type

- TypeScript의 타입 시스템은 구조적이다. 따라서 한 변수 값이 type에 필요한 모든 요소를 포함한다면 그 변수는 해당하는 type이 될 수 있다.
  ```tsx
  const foo: Foo = {
    a: 123,
    b: 'abc',
  };
  ```
- 이러한 구조를 정의할 때 클래스가 아닌 인터페이스를 활용한다.

  ```tsx
  interface Foo {
    a: number;
    b: string;
  }

  const foo: Foo = {
    a: 123,
    b: 'abc',
  };
  ```

- 클래스를 통해 정의하게 되면 해당 클래스를 통해 정의한 변수를 활용할 때, 에러가 변수가 정의된 곳이 아닌 함수를 사용하는 곳에서 나타나고, 디버깅에 불리하게 작용된다. 따라서 인터페이스를 사용한다.

  ```tsx
  interface Animal {
    sound: string;
    name: string;
  }

  function makeSound(animal: Animal) {}

  /**
   * 'cat' has an inferred type of '{sound: string}'
   */
  const cat = {
    sound: 'meow',
  };

  /**
   * 'cat' does not meet the type contract required for the function, so the
   * TypeScript compiler errors here, which may be very far from where 'cat' is
   * defined.
   */
  makeSound(cat);

  /**
   * Horse has a structural type and the type error shows here rather than the
   * function call.  'horse' does not meet the type contract of 'Animal'.
   */
  const horse: Animal = {
    sound: 'niegh',
  };

  const dog: Animal = {
    sound: 'bark',
    name: 'MrPickles',
  };

  makeSound(dog);
  makeSound(horse);
  ```

## 6.4 type literal alias 대신 인터페이스 사용하기

- 객체를 선언할 때 인터페이스를 통해 타입을 정한다.

  ```tsx
  interface User {
    firstName: string;
    lastName: string;
  }

  //사용하지 않는 방식
  type User = {
    firstName: string;
    lastName: string;
  };
  ```

## 6.5 Array<T> 타입

- 복잡하지 않은 배열 타입의 경우(단순한 알파벳, 숫자 값이 들어가는 경우), T[], readonly T[] 형식으로 선언한다. Array<T> 또는 ReadonlyArray<T>는 사용하지 않는다.
- 다차원 배열의 경우 T[][]. T[][][] …과 같은 형식으로 선언한다.
- 더 복잡한 배열의 경우 Array<T>의 형식으로 선언한다.
- nesting을 할 때 같은 규칙이 적용된다.

  ```tsx
  let a: string[];
  let b: readonly string[];
  let c: ns.MyObj[];
  let d: string[][];
  let e: Array<{n: number; s: string}>;
  let f: Array<string | number>;
  let g: ReadonlyArray<string | number>;

  let h: InjectionToken<string[]>; // Use syntax sugar for nested types.
  let i: ReadonlyArray<string[]>;
  let j: Array<readonly string[]>;
  ```

## 6.6 인덱스 타입 / 인텍스 시그니처( {[key: string]: T} )

- JavaScript에서 mpa, hash, dict와 같은 키-값 배열 구조를 사용할 수 있다. TypeScript에서는

[k: string]: T 모양으로 선언할 수 있다.

- TypeScript에서 key에 대한 라벨을 알기 쉽게 설정해야 한다.

  ```tsx
  //Bad
  const users: {[key: string]: number} = ...;

  //Better
  const users: {[userName: string]: number} = ...;
  ```

- 하지만 이런 기능보다는 ES6에 포함되어 있는 Map과 Set을 사용하는것이 바람직하다.
- TypeScript의 내장 `Record<Keys, ValueType>`type은 정의된 키 집합으로 타입을 구성할 수 있게 해준다. 이것은 키가 정적으로 알려져 있다는 점에서 연관 배열과 다르다.

## 6.7 매핑된 타입과 조건부 타입

- TypeScript의 매핑된 타입과 조건부 타입은 다른 타입을 기반으로 새로운 타입을 지정할 수 있게 해준다. TypeScript의 표준 라이브러리에는 이러한 타입 연산자( `Record` , `Partial`,  `Readonly` 등)가 여러 개 포함되어 있다.
- 이러한 타입 시스템 기능은 타입을 간결하게 지정하고 강력하면서도 유형이 안전한 추상화를 구성할 수 있게 한다. 그러나 다음과 같은 단점들이 존재한다.
  - 명시적으로 속성과 타입 관계를 지정하는 것(예: `interface`와 `extends`를 사용하는 방식, 아래 예 참조)에 비해, 타입 연산자는 독자가 타입 표현식을 정신적으로 평가해야 한다. 특히, 타입 추론 및 파일 경계를 넘는 표현식과 결합될 경우, 코드를 훨씬 더 읽기 어렵게 만들 수 있다.
  - 매핑 및 조건부 타입의 평가 모델은, 특히 타입 추론과 결합될 경우, 명확하게 규정되지 않고 항상 잘 이해되는 것도 아니며, TypeScript 컴파일러 버전에 따라 자주 변경될 수 있다. 이로 인해 코드가 우연히 컴파일되거나, 올바른 결과를 제공하는 것처럼 보일 수 있다. 이는 타입 연산자를 사용하는 코드의 장기적인 유지보수 비용을 증가시킨다.
  - 매핑 및 조건부 타입은 복잡하거나 추론된 타입에서 타입을 파생할 때 가장 강력하지만, 반대로 이럴 때 프로그램이 이해 및 유지보수가 어렵게 되는 경우가 많다.
  - 일부 언어 도구는 이러한 타입 시스템 기능과 잘 작동하지 않는다. 예를 들어, IDE의 "참조 찾기" 기능(및 속성 이름 변경 리팩토링)은 `Pick<T, Keys>` 타입의 속성을 찾지 못하고, 코드 검색도 해당 속성에 하이퍼링크를 제공하지 않을 수 있다.
- 스타일 권장사항
  - 코드를 표현할 수 있는 가장 단순한 타입 구성 요소를 사용한다.
  - 약간의 반복은 복잡한 타입 표현식보다 유지보수 비용이 저렴할 수 있다.
- 예를 들어, TypeScript의 내장 `Pick<T, Keys>` 타입은 기존 타입 `T`에서 특정 속성만을 선택하여 새로운 타입을 생성할 수 있게 한다. 그러나 간단한 `interface` 상속이 종종 더 이해하기 쉬울 수 있다.

  ```tsx
  interface User {
    shoeSize: number;
    favoriteIcecream: string;
    favoriteChocolate: string;
  }

  // FoodPreferences는 favoriteIcecream과 favoriteChocolate을 포함하지만,
  //shoeSize는 포함하지 않는다.
  type FoodPreferences = Pick<User, 'favoriteIcecream' | 'favoriteChocolate'>;
  ```

- 이는 `FoodPreferences`의 속성을 명시적으로 정의하는 것과 동일하다:
  ```tsx
  interface FoodPreferences {
    favoriteIcecream: string;
    favoriteChocolate: string;
  }
  ```
- 중복을 줄이기 위해 `User`가 `FoodPreferences`를 확장하거나(상속), 혹은 (더 나은 방법으로) `foodPreferences`라는 필드를 중첩시킬 수 있다:
  ```tsx
  interface FoodPreferences {
    /* 위와 동일 */
  }
  interface User extends FoodPreferences {
    shoeSize: number;
    // foodPreferences도 포함됩니다.
  }
  ```
- 여기서 `interface`를 사용하는 것은 속성의 그룹화를 명시적으로 보여주며, IDE 지원을 개선하고, 최적화를 가능하게 하며, 코드를 더 이해하기 쉽게 만든다.

## 6.8 any 타입

- TypeScript의 any 타입은 다른 타입의 슈퍼, 서브타입이며 모든 요소들에 대해 역참조하는 것이 가능하다. 따라서 많은 오류를 발생시키고, TypeScript의 장점을 없애는 것이므로 사용하지 않는 것이 좋다.
- 따라서 any를 사용하지 않는 것이 바람직하고, 아래와 같은 방법들을 사용한다.

### 6.8.1 더 구체적인 타입 제시

- 인터페이스, 인라인 객체 타입, 타입 alias를 사용한다.

  ```tsx
  // Use declared interfaces to represent server-side JSON.
  declare interface MyUserJson {
    name: string;
    email: string;
  }

  // Use type aliases for types that are repetitive to write.
  type MyType = number | string;

  // Or use inline object types for complex returns.
  function getTwoThings(): {something: number; other: string} {
    // ...
    return {something, other};
  }

  // Use a generic type, where otherwise a library would say `any` to represent
  // they don't care what type the user is operating on (but note "Return type
  // only generics" below).
  function nicestElement<T>(items: T[]): T {
    // Find the nicest element in items.
    // Code can also put constraints on T, e.g. <T extends HTMLElement>.
  }
  ```

### 6.8.2 **`any` 대신 `unknown` 사용**

- any 타입은 한 요소를 모든 타입으로 사용하게끔 하고, 역참조가 가능하게 한다. 이러한 행동은 보통 필요 없으므로, 타입이 **`unknown`** 이라는 것만 명시해줘도 된다. 임의의 요소를 역참조하지 않고 이러한 개념을 나타낼 수 있으므로 **`unknown`** 을 사용한다**.**

  ```tsx
  // Can assign any value (including null or undefined) into this but cannot
  // use it without narrowing the type or casting.
  const val: unknown = value;

  const danger: any = value; /* result of an arbitrary expression */
  danger.whoops(); // This access is completely unchecked!
  ```

### 6.8.3 **`any` 린트 경고 억제하기**

- 때때로 `any`를 사용하는 것이 정당할 때가 있다. 예를 들어, 테스트에서 목(mock) 객체를 생성할 때인데, 이러한 경우, 린트 경고를 억제하는 주석을 추가하고, 왜 그것이 정당한지 설명해야 한다.
  ```tsx
  // This test only needs a partial implementation of BookService, and if
  // we overlooked something the test will fail in an obvious way.
  // This is an intentionally unsafe partial mock
  // tslint:disable-next-line:no-any
  const mockBookService = {
    get() {
      return mockBook;
    },
  } as any as BookService;
  // Shopping cart is not used in this test
  // tslint:disable-next-line:no-any
  const component = new MyComponent(
    mockBookService,
    /* unused ShoppingCart */ null as any,
  );
  ```

## 6.9 {} 타입

- `{}` 타입, 빈 인터페이스 타입이라고도 불리는 이 타입은 속성이 없는 인터페이스를 나타낸다. 빈 인터페이스 타입은 지정된 속성이 없으므로, `null`이나 `undefined`가 아닌 모든 값이 할당될 수 있다.

  ```tsx
  let player: {};

  player = {
    health: 50,
  }; // 허용됨

  console.log(player.health); // 오류: '{}' 타입에 'health' 속성이 존재하지 않습니다.

  function takeAnything(obj: {}) {}

  takeAnything({});
  takeAnything({a: 1, b: 2});
  ```

- Google3 코드에서는 대부분의 경우 `{}` 타입을 사용하지 않는 것이 좋다. `{}`는 `null`이나 `undefined`를 제외한 모든 원시 값과 객체 타입을 나타내며, 이는 대부분의 경우 적절하지 않다. 대신, 다음과 같은 더 명확한 타입을 사용하는 것이 좋다:
  - `unknown`: `null` 및 `undefined`를 포함한 모든 값을 저장할 수 있으며, 주로 불투명한 값을 다룰 때 더 적합하다.
  - `Record<string, T>`: 사전(Dictionary)과 같은 객체에 적합하며, 포함된 값의 타입 `T`를 명시함으로써 더 나은 타입 안정성을 제공한다. (여기서 `T`는 `unknown`일 수도 있다.)
  - `object`: 원시 값을 제외한 모든 `null`이 아닌 객체와 함수를 나타내며, 사용 가능한 속성에 대해 다른 가정은 하지 않는다.

## 6.10 튜플 타입

- Pair와 같은 타입을 사용하려면 튜플 타입을 사용한다.

  ```tsx
  function splitInHalf(input: string): [string, string] {
    ...
    return [x, y];
  }

  // Use it like:
  const [leftHalf, rightHalf] = splitInHalf('my string');
  ```

- 종종 요소에 의미 있는 이름을 제공하는 것이 더 명확하다.
- 인터페이스 선언이 번거롭다면 인라인 객체 리터럴 타입을 사용한다.

  ```tsx
  function splitHostPort(address: string): {host: string, port: number} {
    ...
  }

  // Use it like:
  const address = splitHostPort(userAddress);
  use(address.port);

  // You can also get tuple-like behavior using destructuring:
  const {host, port} = splitHostPort(userAddress);
  ```

## 6.11 wrapper 타입

- JavaScript의 primitive 타입과 관련하여 사용하지 말아야 할 타입들이 있다.
  - String, Boolean, Number는 소문자 string, boolean, number와 다르다. 항상 소문자 버전을 사용한다.
  - Object는 {}와 object와 비슷하지만, 더 느슨하다.
    - {}는 null과 undefined를 제외한 모든 값을 포함한다.
    - object는 원시 타입을 제외한 비원시(non-primitive) 타입만 포함된다.
- wrapper 타입을 생성자로 사용하지 않는다.(new Number(), new String())

## 6.12 return 타입만 제네릭

- return 타입만 제네릭인 API를 만드는 것을 피한다. 항상 제네릭을 명시적으로 지정해야 한다.

---

# 7 툴체인 요구사항

구글 스타일은 여러 툴을 특정 방식으로 사용을 요구합니다. 이 내용은 아래에 있습니다.

## 7.1 타입스크립트 컴파일러

모든 타입스크립트 파일은 표준 툴체인을 사용하여 타입 검사를 통과해야 합니다.

### 7.1.1 @ts-ignore

@ts-ignore 혹은 다른 변형인 @ts-expect 나 @ts-nocheck 를 사용하면 안됩니다.

왜냐하면

이는 컴파일 에러를 고치는 쉬운 방법처럼 보이겠지만, 실제로 특정 컴파일 에러는 더 큰 문제에 의해 발생되기 때문에 이를 좀 더 직접 고치는 것이 좋습니다.

예를들어, 당신이 타입 에러를 발생시키지 않게 하기위해 @ts-ignore를 사용한다면, 주변 코드가 어떤 타입을 인식하게 될지 예측하기가 어려워 집니다. 많은 타입 오류의 경우 ‘any’ 를 효과적으로 사용하는 방법(6.8)을 참고 하는 것이 유용합니다.

@ts-expect-error는 일반적으로는 사용하지 않아야 하지만 단위테스트시에 사용할 수 있습니다. 그러나 @ts-expect-error는 모든 오류를 억제합니다. 그러므로 과도하게 매칭되고 더 심각한 오류를 억제하기 쉽습니다. 그러므로 아래의 방법들을 고려해보세요.

- 실행시에 확인되지 않은 값을 다뤄야 하는 API를 테스트 할 때는 예상되는 타입이나 any로 타입캐스팅을 하고 이를 설명하는 주석을 첨부하세요. 이렇게 하면 오류 억제가 단일 표현식으로 제한됩니다.
- lint warning을 억제하고 그 이유를 문서화 하십시오. 이는 any에 대한 lint warning을 억제하는 것과 비슷합니다(6.8.3).

## 7.2 준수 규칙

구글 TypeScript는 몇가지 준수 규칙을 위한 프레임워크를 포함합니다. [tsetse](https://tsetse.info/)와 [tsec](https://github.com/google/tsec)

이러한 규칙들은 강력한 제한을 두거나(코드 베이스가 깨질 수 있는 전역의 사용 등) 그리고 보안 패턴(eval을 사용하거나 innerHTML에 할당(이는 보안에 취약한 행위))을 강제하거나 더 나은 코드의 퀄리티를 위한 규칙을 강제하도록 합니다.

---

# 8 주석과 문서화

### 8.0.1 JSDoc 과 일반 주석

주석에는 두가지의 종류가 있습니다, JSDoc(/\*_ … _/) 과 일반 주석(// or /_ … _/\*)

- 문서화를 위한 경우에는 JSDoc을 사용하십시오, i.e. 코드 사용자가 꼭 읽어야 할 때
- 코드 구현에 대한 주석은 // line 주석을 사용하십시오, i.e. 주석이 오직 코드의구현 그자체에만 관련이 있을 때

JSDoc 주석은 에디터나 문서 generator와 같은 tool이 이해 할 수 있습니다. 반면에 일반적인 주석은 오직 인간만이 이해할 수 있습니다.

### 8.0.2 여러 줄 주석

여러 줄 주석은 주변 코드와 동일한 수준으로 들여쓰기를 합니다. 여러 줄 주석은 여러개의 // line 주석으로 사용합니다, /_ … _/ 다음과 같은 블럭 주석을 사용하지 않습니다.

```tsx
// 이것은
// 좋은 예 입니다
```

```tsx
/*
 * 이는
 * 사용해서는
 * 안됩니다
 */

/* 이것보다는 // 라인 주석을 사용하세요 */
```

주석은 \*(asterisk) 나 다른 기호로 그려진 박스에 감싸져서는 안됩니다.

## 8.1 JSDoc 의 일반 형식

JSDoc 주석의 기본적인 형식은 아래의 예를 참고하십시오.

```tsx
/**
 * 여러줄의 JSDoc은 여기에 작성됩니다,
 * 일반적인 방식으로 줄바꿈을 하여 작성합니다.
 * @param arg 어떤작업을 수행하는 숫자입니다.
 */
function doSomething(arg: number) {...}
```

또는 아래와 같이 단일 줄 형식으로도 작성할 수 있습니다.

```tsx
/** 이는 함수를 설명하는 짧은 JSDoc 입니다. */
function doSomething(arg: number) {...}
```

만약 하나의 line 주석이 여러줄로 넘어가게 된다면, 여러 줄 주석 형태를 사용해야 합니다.

많은 툴들은 코드의 검증과 최적화를 수행하기 위해 JSDoc 주석으로 부터 메타데이터를 추출 합니다. 따라서 이러한 주석들은 올바른 형식으로 구성되어야 합니다.

## 8.2 Markdown

JSDoc은 Markdown 형식으로 작성됩니다, 필요하다면 HTML도 포함될 수 있습니다.

JSDoc을 파싱하는 작업을 할 때 일반 텍스트 서식은 무시합니다. 아래는 그러한 예 입니다.

```tsx
/**
 * Computes weight based on three factors:
 *   items sent
 *   items received
 *   last timestamp
 */
```

위의 JSDoc은 아래와 같이 렌더링 됩니다.

```tsx
Computes weight based on three factors: items sent items received last timestamp
```

위 대신에 다음과 같이 Markdown 목록 형식을 사용하십시오

```tsx
/**
 * Computes weight based on three factors:
 *
 * - items sent
 * - items received
 * - last timestamp
 */
```

## 8.3 JSDoc tags

구글 스타일은 JSDoc 태그의 일부만 허용합니다. 대부분의 태그는 각자의 line의 시작부분에 독립적으로 작성이 되어야 합니다.

아래는 올바른 예 입니다.

```tsx
/**
 * "param" 태그는 자신의 라인에 독립적으로 존재해야하며 여러 태그가 결합되어서는 안됩니다.
 * @param left A description of the left param.
 * @param right A description of the right param.
 */
function add(left: number, right: number) { ... }
```

아래는 잘못된 예 입니다.

```tsx
/**
 * "param" 태그는 자신의 라인에 독립적으로 존재해야하며 여러 태그가 결합되어서는 안됩니다.
 * @param left @param right
 */
function add(left: number, right: number) { ... }
```

## 8.4 줄 나누기

블록 태그의 줄을 나눌 때는 4칸 들여쓰기를 해야합니다.

줄 바꿈된 설명 텍스트는 이전의 라인과 수평정렬을 할 수 있지만 이는 권장되지 않습니다. 대신에 4칸 들여쓰기를 사용합니다.

```tsx
/**
 * 긴 param/return 설명에 대한 줄 나누기의 예 입니다.
 * @param foo This is a param with a particularly long description that
 *     doesn't fit on one line
 * @return This returns something that has a lengthy description too
 *     long to fit in one line.
 */
exports.method = function (foo) {
  return 5;
};
```

@desc 나 @fileoverview 설명에 대한 줄바꿈은 들여쓰기를 하지 마십시오.

## 8.5 모든 최상위 모듈 내보내기에 대한 문서화

당신의 코드를 사용하는 사용자에게 정보를 전달하려면 JSDoc 주석을 사용하십시오. 단순히 속성이나 파라미터 이름을 반복하는 것은 피해야 합니다. 목적이 그들의 이름만으로는 명확하게 드러나지 않는 모든 속성과 method(export되거나/public과 무관한)에 리뷰어가 이를 판단 할 수 있도록 문서화 해야합니다.

**예외:** 오직 툴에 의해 사용되도록 exported 된 symbol(@NgModule classes와 같은)은 주석을 요구하지 않습니다.

## 8.6 클래스 주석

클래스에 대한 JSDoc 주석은 독자에게 어떻게, 언제 해당 클래스를 사용해야 하는지를 알 수 있도록 충분한 정보를 제공해야 합니다. 뿐만 아니라 클래스를 올바르게 사용할 수 있도록 추가적인 고려사항도 제공해야 합니다.

생성자에서는 텍스트 설명이 생략될 수 있습니다.

## 8.7 메소드와 함수 주석

해당 메소드에 대한 JSDoc이 이미 명확하거나 혹은 메소드 이름과 타입 시그니처 부터 명확해 진다면 메소드, 파라미터, return 에 대한 설명은 생략 될 수 있습니다.

메소드에 대한 설명은 해당 메소드가 무엇을 하는지를 동사형으로 시작해야 합니다. 이 설명은 명령문의 형태가 아닌 제 3인칭으로 작성을 합니다. 암묵적으로 “This method …”가 앞에 있다고 생각합니다.

아래는 올바른 예 입니다.

```tsx
/**
 * Sorts the list of users alphabetically.
 * @param users An array of user objects to be sorted.
 * @return A new array of users sorted by name.
 */
function sortUsers(users: User[]): User[] {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}
```

명확한 메소드 이름과 함께 간결한 동사구를 사용해 메소드 주석을 작성하였습니다.

아래는 잘 못 된 예 입니다.

```tsx
/**
 * Sort the users alphabetically. // 명령문은 피해야 합니다.
 */
function sortUsers(users: User[]): User[] {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}
```

명령문 형식은 피해야 합니다.

## 8.8 매개변수 속성에 대한 주석

매개변수 속성은 private, protected, public, or readonly 와 같은 접근자가 붙여진 생성자 매개변수를 의미합니다.

매개변수 속성은 매개변수와 인스턴스 속성을 모두를 선언하고 암묵적으로 인스턴스 속성에 할당 됩니다.

예를들어, constructor(private readonly foo: Foo), 이는 foo 매개변수를 가진 생성자를 선언하고. private, readonly 속성인 foo를 선언하며, foo 매개변수에 foo 속성을 자동으로 할당 합니다.

이를 문서화 하기 위해서는, JSDoc의 @param 어노테이션을 사용해야 합니다.

에디터는 생성자를 호출할 때, 속성에 접근할 때 주석설명을 보여줍니다.

아래는 매개변수 속성에 대한 문서화 예시 입니다.

```tsx
/** 클래스는 매개변수 속성의 문서화 방법을 보여줍니다. */
class ParamProps {
  /**
   * @param percolator The percolator used for brewing.
   * @param beans The beans to brew.
   */
  constructor(
    private readonly percolator: Percolator,
    private readonly beans: CoffeeBean[],
  ) {}
}
```

아래는 일반 속성에 대한 문서화 예시 입니다.

```tsx
/** 클래스는 일반 속성에 대한 문서화 방법을 보여줍니다. */
class OrdinaryClass {
  /** The bean that will be used in the next call to brew(). */
  nextBean: CoffeeBean;

  constuctor(initialBean: CoffeeBean) {
    this.nextBean = initialBean;
  }
}
```

## 8.9 JSDoc 타입 어노테이션

@param 또는 @return 블럭에서 타입은 선언하면 안된다.

아래는 잘 못 된 예 입니다.

```tsx
/**
 * @param foo {string} A string parameter.
 * @return {number} A number result.
 */
function doSomething(foo: string): number {
  return foo.length;
}
```

아래는 올바른 예 입니다.

```tsx
/**
 * @param foo A string parameter.
 * @return A number result.
 */
function doSomething(foo: string): number {
  return foo.length;
}
```

타입스크립트는 이미 타입 정보를 제공하기 때문에 해당 어노테이션에서 타입을 선언하지 않습니다.

JSDoc 타입 어노테이션들은 TypeScript 소스코드에서 중복이 됩니다.

그러므로 이미 implements, enum, private, override를 사용하는 코드에서는 다음의 어노테이션(@implements, @enum, @private, @override 등)을 사용하지 않습니다.

아래는 잘 못 된 예 입니다.

```tsx
/**
 * @private
 */
private doSomethingPrivate() {
  // ...
}
```

아래는 올바른 예 입니다.

```tsx
private doSomethingPrivate() {
  // ...
}
```

TypeScript의 접근 제한자를 그대로 사용하고, 주석은 생략합니다.

## 8.10 유의미한 정보가 담긴 주석작성

이름과 함수의 타입 혹은 매개변수로 충분하다면 굳이 문서화를 하지 않아도 된다.

- 단지 매개변수 명과 타입을 재진술하는 주석을 피하라.
  ```tsx
  ** @param fooBarService The Bar service for the Foo application. */
  ```
- @param 과 @return 역시 유의미한 정보가 필요하다면 사용하지만 그렇지 않다면 생략하는 것이 좋다.
  ```tsx
  /**
   * POSTs the request to start coffee brewing.
   * @param amountLitres The amount to brew. Must fit the pot size!
   */
  brew(amountLitres: number, logger: Logger) {
    // ...
  }
  ```

### 8.10.1 함수 호출시 주석

매개변수 이름에 대한 주석은 메소드 이름과 매개변수 값이 충분히 매개변수의 의미를 전달하지 못할 때 필요하다.

이러한 주석을 달기 전에 해당 함수가 충분히 의미를 전달 할 수 있게 리팩토링을 고려해보고 주석을 달지 말지 결정한다.

매개변수 이름 주석은 매개변수 값 앞에 작성하며 매개변수 이름과 ‘=’ 기호를 포함한다.

```tsx
someFunction(obviousParam, /* shouldRender= */ true, /* name= */ 'hello');
```

매개변수 이름 주석에 대한 레거시 스타일은 다음과 같다.

주석을 매개변수 값 뒤에 오도록 하며 ‘=’ 기호는 생략한다.

```tsx
someFunction(obviousParam, true /* shouldRender */, 'hello' /* name */);
```

## 8.11 Decorator 앞에 주석 작성

class, method, 또는 속성이 @Components와 같은 데코레이터와 JSDoc을 둘다 가질 때, JSDoc을 데코레이터 보다 먼저 작성하도록 한다.

- JSDoc을 데코레이터와 선언 사이에 작성하지 않습니다.
  아래는 잘 못 된 예 입니다.
  ```tsx
  @Component({
    selector: 'foo',
    template: 'bar',
  })
  /** Component that prints "bar". */
  export class FooComponent {}
  ```
- JSDoc을 데코레이터 앞에 작성합니다.
  아래는 올바른 예 입니다.
  ```tsx
  /** Component that prints "bar". */
  @Component({
    selector: 'foo',
    template: 'bar',
  })
  export class FooComponent {}
  ```

---

# 9 정책

## 9.1 일관성 유지

스타일 가이드에서 명확하게 정해지지 않은 사항에 대해서는 동일 파일 내에 다른 코드부분과 일관성을 유지 해야합니다. 만약 그래도 해결이 되지 않았다면 동일한 디렉토리내에 있는 다른 파일을 참고하여 일관되게 작성합니다.

새로운 파일은 동일 패키지내에 있는 다른 파일의 스타일 형식과는 관계없이 구글 스타일을 사용해야 합니다.

구글 스타일이 아닌 파일에 새로운 코드를 추가할 때는 우선 **존재하는 코드를 리팩토링(9.1.1)**하는 것을 추천합니다. 리팩토링이 이루어지지 않으면, 새로운 코드를 같은 파일에 있는 존재하는 코드와 가능한한 일관성을 유지해야 합니다. 하지만 스타일가이드를 위반해서는 안됩니다.

### 9.1.1 존재하는 코드를 리팩토링

구글 스타일 가이드를 따르지 않는 파일을 보게 될 수 있습니다.

존재하는 코드의 스타일을 갱신할 때 다음의 가이드라인을 따르십시오.

1. 현재의 스타일 가이드라인을 만족시키기 위해 모든 존재하는 코드를 바꾸는 것은 요구되지 않습니다. 존재하는 코드를 리팩토링 하는 것은 코드의 변화량과 일관성을 맞교환 하는 것입니다. 스타일 규칙은 시간이 흐르면서 진화하고 점점 발생한 규칙들은 너무 많은 불필요한 변경을 만들어 냅니다. 하지만 만약 매우 중요한 변화가 필요하다 해당 파일은 구글 스타일을 따라야 합니다.
2. 스타일 수정이 클 변경의 중심이 아닌 경우, 이러한 스타일 수정은 별도의 CL(변경 목록)로 분리하여 제출하는 것이 좋습니다.

## 9.2 사용 중단(Deprecation)

사용 중단 된 메소드, 클래스, 인터페이스는 @deprecated 의 어노테이션으로 표시한다.

사용중단에 대한 주석은 해당 call을 교체할 간단하고 명확한 지침을 포함해야 한다.

## 9.3 생성된 코드

빌드 프로세스에 의해 생성된 소스코드는 구글스타일을 따르지 않아도 된다.

하지만 직접 작성한 소스코드로 부터 참조되는 생성된 식별자는 이름 규칙을 따라야한다.

예외적으로 이러한 식별자는 언더스코어(\_)를 포함하도록 하며 이는 직접 작성한 식별자와의 충돌을 피하는 데 도움이 될 수 있다.

### 9.3.1 스타일 가이드 목표

일반적으로, 엔지니어들을 그들의 코드에서 무엇이 요구되는 지 가장 잘 안다. 그러므로 다양한 선택지가 있고 선택이 상황에 따라 다르다면, 해당 결정은 로컬하게 결정되어야 한다. 그러므로 기본적으로 스타일가이드를 꼭 따를 필요는 없다.

하지만 다음의 쟁점은 예외사항이다.

당신의 스타일가이드 제안을 평가 해봐라

1. 코드는 문제를 일으킬 패턴은 피해야 한다 특히 유저가 언어에 익숙하지 않을 때
2. 프로젝트간의 코드는 변화에 관계 없이 일관성을 유지해야한다.

   두가지 동일한 옵션이 있을 때, 우리는 하나를 선택해야한다. 그렇게 함으로써 코드리뷰를 할 때 불필요한 변형을 피하고 불필요한 논쟁을 방지 할 수 있다.

   예를 들어

   - 이름의 대문자
   - 완전 동일한 x as T 문법과 <T>x 문법
   - Array<[number, number]> 와 [number, number][]

   이러한 상황일 때는 일관된 스타일 가이드를 따르는 것이 좋다.

3. 코드는 오랜기간 유지 되어야 한다.

   코드는 원작자가 작업을 마쳐도 더 오랫동안 살아남기 때문에 타입스크립트 팀은 구글의 모든 코드가 미래에 유지 되도록 관리해야 합니다.

   예시들

   - 코드를 자동으로 변경하기위해 소프트웨어를 사용한다, 코드는 자동 포매팅을 통해 소프트웨어가 공백 규칙을 쉽게 충족할 수 있도록 합니다.
   - 특정 TS 라이브러리는 특정 컴파일러 플래그 세트를 가정하고 작성되어야 하며, 이를 통해 사용자는 항상 안전하게 공유 라이브러리를 사용할 수 있습니다.
   - 코드는 사용하는 라이브러리를 임포트 해야하며 그러므로 의존성을 리팩토링하는 것이 그것의 사용자의 의존성을 바꿀 수는 없다.
   - 테스트를 해야한다. 테스트 없이는 우리가 언어나 코드를 변경할 때, 그 변경이 사용자에게 문제가 될 수 있다는 확신을 가질 수 없습니다.

4. 코드 리뷰어들은 임의의 규칙을 강요 하기보다는 그 코드의 품질을 개선하는 것에 집중해야한다.

   만약 규칙을 자동화된 검사로 구현이 가능하다면 이는 좋은 신호이다. 이는 3번 원칙을 지지한다.

   만약 그 문제가 중요하지 않다면 — 예를들어 그것이 language의 드문 부분이거나 거의 발생 가능성이 없는 버그를 피하고자 한다면 — 이는 해당 규칙을 따르지 않는 것이 더 좋을 것이다.
