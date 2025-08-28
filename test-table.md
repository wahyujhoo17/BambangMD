# Test Table

## Form Status States

| Status      | Deskripsi                                              | Dapat Diakses Oleh            |
| ----------- | ------------------------------------------------------ | ----------------------------- |
| draft       | Form baru dibuat, belum disubmit untuk approval        | Creator, Superadmin           |
| open        | Form telah disubmit dan menunggu approval step pertama | Creator, Approver, Superadmin |
| in_approval | Form sedang dalam proses approval (step 2+)            | Creator, Approver, Superadmin |
| approved    | Form telah diapprove semua step, siap untuk payment    | Creator, Finance, Superadmin  |
| rejected    | Form ditolak dan perlu revisi                          | Creator, Superadmin           |

## Permission Matrix

| Action              | Creator | Approver  | Finance | Superadmin |
| ------------------- | ------- | --------- | ------- | ---------- |
| Create Form         | Yes     | No        | No      | Yes        |
| Edit Draft          | Yes     | No        | No      | Yes        |
| Submit for Approval | Yes     | No        | No      | Yes        |
| Approve Form        | No      | Yes\*     | No      | Yes        |
| Reject Form         | No      | Yes\*     | No      | Yes        |
| Resubmit Form       | Yes     | No        | No      | Yes        |
| Make Payment        | No      | Yes\*\*   | Yes     | Yes        |
| Close Form          | No      | Yes\*\*\* | Yes     | Yes        |
| View Form           | Yes     | Yes       | Yes     | Yes        |

### Notes:

- \* Only for forms assigned to the approver
- \*\* Only after approval is complete
- \*\*\* Only after payment is made
  | Reject Form | No | Yes\* | No | Yes |
