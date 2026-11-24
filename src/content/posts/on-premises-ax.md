---
title: "온프레미스 AX, 무엇부터 시작할까? Environment over Apps"
author: "noah"
pubDatetime: 2026-11-18T22:00:00+09:00
featured: false
draft: false
tags:
  - llm
  - backend
  - mcp
  - operations
description: "사내 모델을 업무 도구에 연결해 보며 정리한 기업 AI 도입 방향. 회사가 먼저 갖출 환경과 수요에 맞춰 투자할 도구·서비스."
---

사내망에서 Cherry Studio와 Claude Desktop을 구동해 보면서 가장 기대가 낮았던 기능은 브라우저 제어였다. 검색창에 글자를 넣고 결과 하나를 여는 일은 내가 하면 금방 끝난다. 에이전트에 맡기면 검색 결과가 뜬 뒤에도 모델이 다음에 누를 곳을 정할 때까지 기다려야 한다. 몇 번만 화면을 오가도 내가 먼저 마우스를 잡을 것 같았다.

그런데 모델 서빙을 손본 뒤 다시 써 보니, 몇 단계를 거치는 일도 맡겨 두고 결과를 기다릴 만했다. 같은 브라우저 작업을 전후로 재 본 적은 없어 몇 초가 줄었는지는 모른다. 내게 인상적이었던 건 다른 부분이었다. 처음에는 브라우저를 이런 식으로 조작하는 것 자체가 답답할 거라고 생각했다. 막상 모델 응답이 빨라지니 같은 방식의 자동화를 두고도 판단이 달라졌다.

그래서 사내망에서 AI로 업무를 자동화하는 일, 흔히 말하는 온프레미스 AX를 시작한다면 나는 이 질문부터 하고 싶다. **지금 가진 GPU로, 직원이 실제로 일을 맡길 만한 모델을 기다릴 만한 속도로 제공할 수 있을까?** 그 답을 확인하기에 가장 좋은 곳은 직원이 이미 일하고 있는 PC라고 생각한다.

## 업무를 잘게 나누기 전에 모델에 한 번 맡겨 본다

온프레미스에서는 모델을 고르는 일과 그 모델을 운영하는 일을 따로 보기 어렵다. 내가 쓸 수 있던 장비는 H200 8장이 달린 서버 한 대였다. 후보 모델이 도구를 잘 다뤄도 긴 입력이 들어오거나 여러 사람의 요청이 겹칠 때마다 응답이 밀리면, 직원이 쓰는 클라이언트에서도 그대로 기다려야 한다. 응답이 빨라도 모델이 엉뚱한 파일을 읽거나 같은 화면을 계속 오가면 결국 사람이 하던 일을 다시 해야 한다.

<figure style="margin:1.6em 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 292" width="640" role="img" aria-labelledby="ax-wait-title ax-wait-desc" style="display:block;width:100%;height:auto;max-width:640px;margin:0 auto"><title id="ax-wait-title">브라우저와 모델이 번갈아 일하는 순서</title><desc id="ax-wait-desc">검색 결과가 뜨면 사내 모델이 열 문서를 고른다. 본문이 뜨면 모델이 다음 행동을 정한다. 그동안 브라우저는 각각 응답을 기다린다. 가로축은 실행 순서를 나타낸다.</desc><rect x="1" y="1" width="638" height="290" rx="16" fill="#f6f9f6" stroke="#c5d5cb"/><g font-family="system-ui, Noto Sans KR, sans-serif"><text x="24" y="40" font-size="25" fill="#20372e" font-weight="700" text-anchor="start">검색 결과가 뜬 뒤에도 기다리는 이유</text><text x="24" y="84" font-size="17" fill="#52665c" font-weight="400" text-anchor="start">실행 순서</text><path d="M118 78 H608 M600 73 L608 78 L600 83" stroke="#33664e" stroke-width="2" fill="none" /><text x="24" y="135" font-size="19" fill="#20372e" font-weight="700" text-anchor="start">직원 PC</text><text x="24" y="160" font-size="17" fill="#52665c" font-weight="400" text-anchor="start">브라우저</text><text x="24" y="231" font-size="19" fill="#20372e" font-weight="700" text-anchor="start">사내 서버</text><text x="24" y="256" font-size="17" fill="#52665c" font-weight="400" text-anchor="start">모델</text><rect x="118" y="107" width="116" height="64" rx="10" fill="#ffffff" stroke="#c5d5cb"/><text x="176" y="134" font-size="19" fill="#20372e" font-weight="600" text-anchor="middle">검색 결과</text><text x="176" y="158" font-size="19" fill="#20372e" font-weight="600" text-anchor="middle">표시</text><rect x="239" y="107" width="120" height="64" rx="10" fill="#dbede3" stroke="#c5d5cb"/><text x="299" y="145" font-size="19" fill="#33664e" font-weight="650" text-anchor="middle">응답 대기</text><rect x="239" y="204" width="120" height="64" rx="10" fill="#ffffff" stroke="#c5d5cb"/><text x="299" y="231" font-size="19" fill="#20372e" font-weight="600" text-anchor="middle">열 문서</text><text x="299" y="255" font-size="19" fill="#20372e" font-weight="600" text-anchor="middle">선택</text><path d="M176 172 V236 H235 M228 231 L235 236 L228 241" stroke="#33664e" stroke-width="2" fill="none" /><path d="M299 203 V176" stroke="#33664e" stroke-width="2" fill="none" stroke-dasharray="4 4" /><path d="M360 235 H370 V178 M365 186 L370 178 L375 186" stroke="#33664e" stroke-width="2" fill="none" /><rect x="367" y="107" width="116" height="64" rx="10" fill="#ffffff" stroke="#c5d5cb"/><text x="425" y="134" font-size="19" fill="#20372e" font-weight="600" text-anchor="middle">문서 본문</text><text x="425" y="158" font-size="19" fill="#20372e" font-weight="600" text-anchor="middle">표시</text><rect x="488" y="107" width="120" height="64" rx="10" fill="#dbede3" stroke="#c5d5cb"/><text x="548" y="145" font-size="19" fill="#33664e" font-weight="650" text-anchor="middle">응답 대기</text><rect x="488" y="204" width="120" height="64" rx="10" fill="#ffffff" stroke="#c5d5cb"/><text x="548" y="231" font-size="19" fill="#20372e" font-weight="600" text-anchor="middle">다음 행동</text><text x="548" y="255" font-size="19" fill="#20372e" font-weight="600" text-anchor="middle">결정</text><path d="M425 172 V236 H484 M477 231 L484 236 L477 241" stroke="#33664e" stroke-width="2" fill="none" /><path d="M548 203 V176" stroke="#33664e" stroke-width="2" fill="none" stroke-dasharray="4 4" /></g></svg><figcaption style="margin-top:0.65em;text-align:center;font-size:0.9em">한 번 맡긴 일에서도 모델의 응답을 기다리는 구간은 여러 번 생긴다.</figcaption></figure>

내가 후보 모델을 비교한다면 평소에 하던 일을 하나 고를 것 같다. 예를 들어 개발자가 “이 테스트가 왜 실패했는지 찾아 줘”라고 하면, 모델은 실패 로그를 읽고 관련 코드를 찾아 둘을 대조해야 한다. 파일을 뒤질 순서까지 미리 정해 주면 모델이 스스로 어디까지 할 수 있는지 알기 어렵다. 평소처럼 요청한 뒤 어느 파일을 근거로 들었는지, 원인을 제대로 짚었는지, 사람이 중간에 경로를 다시 알려 줘야 했는지를 보면 된다.

시간도 지시를 보낸 순간부터 **쓸 수 있는 결과를 받을 때까지** 재고 싶다. 혼자 쓸 때 끝낸 작업을 동료들이 같은 서버를 쓰는 시간에도 맡겨 보는 식이다. 그때 느려진다면 서버의 첫 응답을 기다렸는지, 도구 실행이 오래 걸렸는지, 모델이 잘못 판단해 같은 일을 다시 했는지 나눠 볼 수 있다. 서빙 옵션을 바꾼 과정은 이전 글에 따로 정리했다. [H200 기반 vLLM 모델 서빙 최적화](https://noahwannagohome.github.io/posts/model-serving-tuning/)

## 직원이 쓰던 도구에 사내 모델을 연결한다

사내망에 Claude Code와 Cline을 연결할 때는 사내 서버 한 대에서 모델을 돌리고, 파일을 읽거나 명령을 실행하는 일은 개발자 PC의 클라이언트가 맡았다. 개발자는 평소 작업하던 저장소에서 코딩 도구를 열면 됐다. 새 웹 화면에 코드를 옮겨 붙이거나 모델에 상황을 설명하려고 로그를 따로 모을 필요가 줄었다. [사내망 LLM 인프라 구축과 게이트웨이 개발기](https://noahwannagohome.github.io/posts/closed-network-llm/)

다른 직무로 넓힐 때도 내가 먼저 제공하고 싶은 환경은 비슷하다. 모델은 사내 GPU 서버에서 함께 쓰고, 파일이나 브라우저를 다루는 곳은 각자의 PC로 둔다. 가령 지난주와 이번 주 자료에서 바뀐 내용을 정리하려는 직원이라면, 평소 쓰는 폴더에서 두 파일을 골라 변경점 초안을 받아 볼 수 있다. 직원에게는 익숙한 작업의 일부만 맡기는 일이고, 운영하는 쪽에서는 그 업무 전용 화면을 먼저 만들지 않아도 된다. 클라이언트에는 그 작업에 필요한 파일과 도구만 열어 주면 된다.

이렇게 시작하고 싶은 이유는 개발팀이 직원들의 일을 전부 알기 어렵기 때문이다. 개발팀 눈에는 ‘주간 보고서 작성’이라는 한 가지 업무로 보이지만, 누군가는 자료를 모으는 데 시간을 쓰고 다른 사람은 지난주와 달라진 숫자의 근거를 찾는 데 시간을 쓴다. 어느 쪽이 더 필요한지 정하기 전에 보고서 작성 순서를 하나로 고정해 버리면, 직원은 자기 일에 맞추려고 다시 손을 대야 한다. 각자 쓰던 도구에서 먼저 해 보면 어떤 부분을 계속 맡기고 싶은지 이야기할 근거가 생긴다.

## 회사가 함께 운영할 것은 현업에서 보인다

여기까지는 회사가 한 번 투자하면 여러 부서가 자기 방식으로 쓸 수 있는 부분이다. 개발자는 저장소에서 실패한 테스트를 들여다보고, 기획자는 지난 회의 자료와 이번 초안을 비교한다. 둘이 같은 모델 서버를 써도 화면이나 일하는 순서까지 같을 이유는 없다. 회사가 먼저 맡을 일은 업무가 몰리는 시간에도 모델을 쓸 수 있게 하고, 직원이 쓰던 도구에서 자기 권한으로 그 모델을 호출할 수 있게 하는 것이다.

그다음 투자는 실제로 겹치는 일에서 찾고 싶다. 기획팀은 회의 자료에 근거를 붙이려고, 운영팀은 문의에 답하려고 같은 사내 문서를 찾는다고 해 보자. 두 팀에 필요한 결과물은 달라도 권한에 맞는 원문과 링크를 가져오는 기능은 함께 쓸 수 있다. 이 부분을 MCP(Model Context Protocol) 도구로 제공하면 문서 시스템이 바뀌었을 때 연결을 한 곳에서 고치면 된다. 브라우저 제어 자체에도 MCP를 쓸 수 있다. 여기서 회사가 결정해야 하는 건 **어떤 사내 기능을 여러 팀이 믿고 쓰도록 계속 운영할 것인가**다.

업무별 서비스에 예산을 쓸 이유는 조금 다르다. 가령 장애 대응에서는 당직자가 바뀐 뒤에도 다음 사람이 어느 조치까지 끝났는지 알아야 한다. 이 경우에는 사내 모델이 로그를 요약하는 기능을 기존 장애 관리 시스템에 붙이고, 담당자와 조치 이력은 그 시스템에 남기는 편이 자연스럽다. 반면 기획자가 매주 자기 초안을 비교하는 일은 익숙한 도구에서 잘 끝나면 그것으로 충분하다. 한 회사 안에서 두 방식은 계속 같이 갈 수 있다.

<style>.ax-invest{margin:1.6em 0;width:100%;text-align:center}.ax-invest .ax-frame{--edge:#c5d5cb;--wire:#33664e;--gap:1rem;box-sizing:border-box;border:1px solid var(--edge);border-radius:1rem;padding:clamp(1rem,3vw,1.5rem);background:#f6f9f6;color:#20372e;line-height:1.45;word-break:keep-all}.ax-invest .ax-title{font-size:1.28rem;font-weight:700;margin-bottom:1rem;text-wrap:balance}.ax-invest .ax-card{display:grid;align-content:center;justify-items:center;gap:.35rem;box-sizing:border-box;padding:1.15rem .75rem;background:white;border:1px solid var(--edge);border-radius:.65rem}.ax-invest .ax-root{background:#dbede3;position:relative}.ax-invest .ax-label{font-weight:650}.ax-invest .ax-name{font-weight:700;font-size:1.15rem;color:#33664e}.ax-invest .ax-note{color:#52665c;font-size:.94rem}.ax-invest .ax-branches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--gap);position:relative;padding-top:2rem}.ax-invest .ax-root:after,.ax-invest .ax-branches:before,.ax-invest .ax-branches>.ax-card:before{position:absolute;content:"";pointer-events:none}.ax-invest .ax-root:after{left:50%;top:100%;height:calc(1rem + 1px);border-left:2px solid var(--wire);transform:translateX(-50%)}.ax-invest .ax-branches:before{top:1rem;left:calc(25% - var(--gap)/4);right:calc(25% - var(--gap)/4);border-top:2px solid var(--wire)}.ax-invest .ax-branches>.ax-card{position:relative}.ax-invest .ax-branches>.ax-card:before{left:50%;bottom:100%;height:1rem;border-left:2px solid var(--wire);transform:translateX(-50%)}.ax-invest figcaption{margin:.7rem auto 0;text-wrap:balance;word-break:keep-all;font-size:.9em}@media(max-width:520px){.ax-invest .ax-branches{grid-template-columns:1fr;padding:1rem 0 0 1.25rem;gap:.75rem}.ax-invest .ax-root:after,.ax-invest .ax-branches:before{display:none}.ax-invest .ax-branches>.ax-card:before{left:-1rem;top:50%;bottom:auto;transform:none;width:1rem;height:0;border:0;border-top:2px solid var(--wire)}.ax-invest .ax-branches>.ax-card:after{position:absolute;content:"";left:-1rem;bottom:50%;height:calc(50% + 1.1rem);border-left:2px solid var(--wire)}.ax-invest .ax-branches>.ax-card:first-child:after{bottom:-.85rem;height:calc(100% + 1.9rem)}}</style>

<figure class="ax-invest" aria-labelledby="ax-invest-title"><div class="ax-frame"><div id="ax-invest-title" class="ax-title">회사에서 함께 마련할 것과 따로 투자할 것</div><div class="ax-card ax-root"><span class="ax-label">직원 누구나 쓰던 도구에서 시작</span><span class="ax-note">사내 모델 서빙 · 기존 클라이언트 · 직원별 접근 권한</span></div><div class="ax-branches"><div class="ax-card"><span class="ax-label">여러 팀의 수요가 겹치면</span><span class="ax-name">공용 MCP 도구</span><span class="ax-note">예) 사내 문서 원문 조회</span></div><div class="ax-card"><span class="ax-label">조직이 결과를 관리하면</span><span class="ax-name">업무별 서비스·연동</span><span class="ax-note">예) 장애 조치 이력과 인계</span></div></div></div><figcaption>개인 작업은 기존 도구에서 이어 간다. 공용 도구와 업무별 서비스에는 각각 필요한 곳에 투자한다.</figcaption></figure>

브라우저 제어를 써 보기 전의 나라면 포털에서 어떤 기능을 도구로 꺼낼지부터 적었을 것 같다. 지금이라면 그 시간에 보유한 GPU로 모델을 돌리고, 서로 다른 일을 하는 직원 몇 명에게 각자 어제 하던 일 하나를 맡겨 보게 하겠다. 다음 주에도 쓰고 싶은 일은 무엇인지, 쓰고 싶었는데 어디서 막혔는지 물어보면 된다. 회사가 공통으로 풀어야 할 문제와 현업에 맡겨 두는 편이 좋은 일을 가르는 데에는 그 대답이 더 도움이 될 것 같다.
