May 20, 2020
==============

Attendees:
----------

**OpenHW:** Mike Thompson<br>
**SiLabs:** Oivind Ekelund, Wajid Minhass, Paul Zavalney, Sebastian Ahmed, Steve Richmond

Notes:
------

Actions: Mike, Wajid.


Topics:
-------
1. Status of Actions from last meeting:

- **Wajid** reports he will be able to start work Debug Vplan and review of the
lowRISC Ibex implementation starting the week of June 8.
- **Mike** has reached out to newly appointed SW TG co-chairs regarding toolchain.
The issue is complex and a solution will be a long time coming.  See topic #2.
- **Mike** to connect the Thales team with both Arjan and Jeremy at Embecosm to
work-out detailed implementation fo the "support code". See topic #2.
- **Mike** to reach out to Craig Blackmore of Embecosm for help. See topic #2.
- **Paul** to send Mike the URL for his working fork. (Closed)
- **Mike** and **Paul** still need to integrate Paul's debug verification strategy
the core-v-verif verification strategy.


2. Toolchain and Test-program Environment

- There are three open actions related to this topic with little to show for it.
- Mike reached out directly to Jeremy Bennett of Embecosm and we discussed the situation in detail.
- "Its complicated" is the short answer.  Jeremy agreed that he should "own" this issue and will propose a solution.


3. Imperas ISS

- Mike reports that the Imperas `OVPsim` Instruction Set Simulator is ready for
deployment and will be merged to the head of the core-v-verif master branch today.
- Using the ISS requires an OVPsim license.  Node-locked licenses will be available
to OpenHW members via the Imperas website.
ACTION:  **Mike** to send Steve Richamond process for OVPsim ISS license floater.


4. Integration of outstanding pull-requests

- Paul commented that the order of verification pull-requests should be in lock-step with the RTL pull-requests.


5. CV32E40P Verification Project Plan

- Current draft of project plan shows RTL Freeze on 2020-10-30.
- Sebastian noted that this was a little later than some might wish for and commented
that the XPULP ISA verification is a significant fraction of overall effort.<br>
ACTION: **Mike** to update plan with XPULP ISA verification deferred and resource
allocated to pull-in date for RTL Freeze.


6. Future meetings

- Now that the full OpenHW leadership team is staffed, meetings at the TWG and TG
level are starting.
- Kick-off of VTG with Steve, Leo and Mike has alreadty happened.
- Working to schedule first "full" VTG meeting next week.
- Team concluded that these "SiLabs specific" VTG meetings will no longer be required
when full VTG meeting are in place.  SiLabs meetings can be on an 'as needed' basis.


May 13, 2020
==============

Attendees:
----------

**OpenHW:** Mike Thompson<br>
**SiLabs:** Oivind Ekelund, Wajid Minhass, Paul Zavalney, Sebastian Ahmed, Steve Richmond, Arjan Bink

Notes:
------

Actions: Mike, Wajid, Paul.


Topics:
-------
1. Status of Actions from last meeting:

- **Mike**: retired the "dm", "scripts", "tb\_MPU", tb\_riscv" and "verilotor-model" testbenches in the core-v-verif repository.
- **Mike** introduced Arjan and Sebastien Jacq of Thales to see if we can set up a fully functional verison of the PULP toolchain at Thales.   See "Toolchain" below.
- **Wajid** reports he will be able to start work Debug Vplan and review of the lowRISC Ibex implementation starting the week of June 8.
- **Mike** has reached out to newly appointed SW TG co-chairs regarding toolchain.  The issue is complex and a solution will be a long time coming.  See topic #2.
- **Mike** and **Paul** still need to integrate Paul's debug verification strategy the core-v-verif verification strategy.

2. "CV32E" project-specific meeting

- Sebastian recommended we have a "CV32E40P" project-specific weekly meeting involving both Design and Verification.  Initial goals of meeting should be to define a project plan for CV32E40P to get to RTL Freeze.

3. Toolchain

- Mike reports that the SW TG has formally accepted the task of defining/supporting the toolchain.  In the meantime, verification will continue to use the PULP toolchain.
- Arjan reports that existing RISC-V Compliance suite compiles cleanly with the PULP toolchain.  The issue is with our
OpenHW "support code".  Since this is OpenHW code, we can resolve this oursevles.<br>
ACTION: **Mike** to connect the Thales team with both Arjan and Jeremy at Embecosm to work-out detailed implementation fo the "support code".

4. Debug verification

- Mike expects to be able to integrate Paul's work this week.  Paul warned that the current tests are "developer code".  :-)
ACTION: **Paul** to send Mike the URL for his working fork.

5. Other Business

- Mike reports that the test program environment (crt0.S, link.ld, etc.) is not stable.  Each of the test programs inherited from PULP has its own set and they are not compatible with each other.  Mike's efforts to consolidate the environment and settled on a single set of files is stalled.<br>
ACTION: **Mike** to reach out to Craig Blackmore of Embecosm for help.


May 6, 2020
==============

Attendees:
----------

**OpenHW:** Mike Thompson<br>
**SiLabs:** Oivind Ekelund, Wajid Minhass, Paul Zavalney, Sebastian Ahmed, Steve Richmond, Arjan Bink

Notes:
------

Actions: Mike, Wajid, Paul.


Topics:
-------
1. Status of Actions from last meeting:

- **Davide** reached out to lowRISC (not Chips Alliance as previously recorded) but has not received confirmation from them regarding their use/verification of riscv-dbg.
- **Mike**: no effort on retiring the "dm", "scripts", "tb\_MPU", tb\_riscv" and "verilotor-model" testbenches in the core-v-verif repository this week.
- **Wajid** has not yet started tasks to provide an estimate of completion for the Vplan and review of the lowRISC Ibex implementation.
- **Mike** has reached out to newly appointed SW TG co-chairs regarding toolchain.  The issue is complex and a solution will be a long time coming.  See topic #2.
- **Mike** and **Paul** still need to integrate Paul's debug verification strategy the core-v-verif verification strategy.
- **Mike** added a [test program environment](https://core-v-docs-verif-strat.readthedocs.io/en/latest/test_program_environment.html) chapter to explan of how/why the toolchain, test program and testbench memory map need to be aligned.  This chapter also includes input from the SW TB co-chairs and Paul Zavalney.


2. Meetings:

- With the TWG and TG leadership in place there may be some changes to how meetings are organized/held going forward.
- I will recommend to VTG that our meeting minutes continue to be captured in core-v-docs in markdown format.


3. Toolchain:

- A team at Thales has discovered that the PULP toolchain we have been using does not support the latest Compliance testsuite from the RISC-V foundation.   (see core-v-verif issue/task [#46](https://github.com/openhwgroup/core-v-verif/issues/46) and pull-request [#95](https://github.com/openhwgroup/core-v-verif/pull/95)).
- It will be some time before the SW TG can put a toolchain in place that meets our needs.
- In the meantime Mike suggested that the recommendation from Sebastien Jacq of Thales is the best: we should all switch to the RISC-V toolchain and later switch to whatever toolchain the SW TG blesses.  This involves some short-term pain during the transition from the PULP to RISC-V toolchain. We will also loose the ability to exercise Xpulp instructions for a time.
- Arjan reports that he has a version of the PULP toolchain that _should_ be able to handle the compliance suite.<br>
ACTION: **Mike** to introduce Arjan and Sebastien Jacq of Thales to see if we ca set up a fully functional verison of the PULP toolchain at Thales.

4. CV32 verification environment update:

- Integration of OVPsim Instruction Set Simulator is progressing.  On a separate fork of the environment we are able to compare all CSRs, GPRs and the PC as each instruction is retired.  Still a few minor issues to resolve before we can integrate these changes onto the master branch.   The goal is to have the ability to run per-instruction comparisons of CSRs, GPRs and the PC for all test-programs (manually written or generated).
- A group at Thales has issued a pull-request to integrate the Google instruction set generator (riscv-dv).   Mike is very motivated to get this in, but it is gated by the Imperas ISS, toolchain and test program environment issues.
- [Pull request #100](https://github.com/openhwgroup/core-v-verif/pull/100) to bring in the debug updates is blocked by the ISS work.  Paul is "inconvenienced, but not blocked" by this. Having said that, it is never a good idea to delay a pull-request for too long, so if the ISS cannot be merged into the trunk by end-of-business on Thursday, May 7, Mike will merge in 

5. Other Busines:

- Arjan enquired about support for the signatures generated by the Compliance testsuite. Mike reported that the existing virtual peripherals inherited from the PULP "core" testbench support a "signature writer", but it is not currently used.   In order for this to work, it needs to be supported in a consistent manner by the test-programs, linker control file and testbench.  It is a goal of the effort currently documented in the Verification Strategy's [test program environment](https://core-v-docs-verif-strat.readthedocs.io/en/latest/test_program_environment.html) to define a single linker control script that is consistent with all known sources of test programs (Compliance, Google generator and manually written tests) and the [virtual peripherals](https://core-v-docs-verif-strat.readthedocs.io/en/latest/sim_tests.html#virtual-peripherals) currently supported in the testbench.


April 29, 2020
==============

Attendees:
----------

**OpenHW:** Davide Schiavone, Mike Thompson<br>
**SiLabs:** Oivind Ekelund, Wajid Minhass, Paul Zavalney, Sebastian Ahmed, Steve Richmond, Arjan Bink

Notes:
------

Actions: Mike, Wajid, Paul.
Note: meeting minutes published on GitHub at core-v-docs/verif/MeetingMinutes.

Topics:
-------
1. Status of Actions from last meeting:
- Mike confirmed that riscv-dbg is being used by lowRISC Ibex.
- Davide reached out to Chips Alliance but has not received confirmation from them regarding their use/verification of riscv-dbg.
- Mike captured strategy for supporting both Core-level and Subsystem-level verification in a single UVM environment in the Verification Strategy.  Arjan provided review comments.
- Wajid has not yet had a chance to start on the review of the core-level debug verification implementation at lowRISC Ibex.
- Davide and Paul completed an update of Debug and Trace features in the user manual (see pr #287).
- Mike completed translation of user manual into restructured text.
- Wajid has not yet had a chance to start on the cv32e40p debug Vplan.

2. New Leadership:

- Mike will generate status for newly appointed VTG co-chairs Steve Richmond and Jingliang Wang.
- Team agreed that our on-going debug-verification effort would proceed as usual since debug is a "low hanging fruit" that needs to be implemented/verified regardless of future direction from the VTG co-chairs and/or TWG.

3. Next Steps:

- Team agreed to consolidate all debug verification into core-v-verif UVM environment.<br>
ACTION: **Mike** to retire the "dm", "scripts", "tb\_MPU", tb\_riscv" and "verilotor-model" testbenches in the core-v-verif repo.
- Need to get started on the debug Vplan.<br>
ACTION: **Wajid** to provide an estimate of completion for the Vplan and review of the lowRISC Ibex implementation.

4. Other Business:

- Team re-iterated that the current focus shall be on debug verification of the core, not subsystem.  Subsystem considerations may be discussed at a future date.
- SiLabs is interested in using the Pulp riscv-dbg IP as the DM for their cv32e40p based subsystem.  No interest in a commercial DM at this time.
- Paul has encountered issues using the PULP toolchain.  Mike reported that this has been a long-standing open issue.<br>
ACTION: **Mike** to reach out to newly appointed SW TG co-chairs.
- Team review Paul's suggested additions to the Verification Strategy to support debug verif.<br>
ACTION: **Mike** and **Paul** to integrate into the core-v-verif verification strategy.<br>
ACTION: **Mike** to provide an explanation of how/why the toolchain, test program and testbench memory map need to be aligned.
- Agree to hold weekly meetings in the same time-slot (Mike to book).


April 15, 2020
==============

Attendees:
----------

**OpenHW:** Davide Schiavone,Mike Thompson<br>
**SiLabs:** Oivind Ekelund, Paul Zavalney, Sebastian Ahmed, Steve Richmond, Arjan Bink

Notes:
------

Actions: Mike, David, Wajid, Paul, Sebastian.<br>
Slides available on GitHub at: https://github.com/openhwgroup/core-v-docs/tree/master/verif/Common/Presentations

Topics:
-------
1. Agreed that we should adopt the PULP-Platform [riscv-debug](https://github.com/pulp-platform/riscv-dbg) as the DM and DTM implementation for at least CV32E40P, CV32E40 and probably CV64A.

- Arjan has reverse-engineered the riscv-debug and it supports the functional sub-blocks and interfaces shown in Figure 1 of the [OBI specification](https://github.com/openhwgroup/core-v-docs/blob/master/cores/cv32e40p/OBI-v1.0.pdf).
- It is believed that this is the DM/DTM being used by lowRISC ibex.<br>
ACTION: Mike to confirm
- Rumour has it that this IP is being verified by Google.<br>
ACTION: Davide to confirm and inquire about projected completion.

2. Agreed that primary verification of debug should be done at the CORE level, not Subsystem level.

- Mike would still like to have the ability to verify debug at both the core and sub-system levels, but agreed with the goal to verify it first at the core level.<br>
ACTION: Mike to illustrate a strategy for supporting both Core-level and Subsystem-level verification in a single UVM environment.
- Verification environment for debug will be the UVM environment (uvmt\_cv32), not the "dm" testbench inherited from RI5CY.<br>
ACTION: Wajid to review Ibex core-level debug verification implementation.

3. Documentation:

- Paul had previously created a pull-request to update Debug and Trace features in the user manual.<br>
ACTION: **Davide** and **Paul** to push that through.
- Mike stupidly admitted that he is working to create a restructured text version of the user manual.<br>
ACTION: **Mike**, get it done and committed to GitHub.<br>
ACTION: **Paul** buys a bottle opener for the wine Davide will owe Mike.
- Need to get started on the debug Vplan.<br>
ACTION: **Wajid** owns this (Paul agreed to contribute)

4. Tracking:

- No strong comments/opinions about using GitHub's "per-repository projects", so Mike will publish tasks as GitHub issues on the CV32E40P Debug Verification project.
- Agreed to hold weekly meetings.
- ACTION: **Sebastian** to suggest convenient time for Austin and Oslo (we can assume these are also convenient for Ottawa and Zurick).

