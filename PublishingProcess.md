# The Publishing Process for Atoms
This is the publishing process for Atom Workshop and recommended best practices for other Tools that create Atoms.

This project uses the [atom maker](https://github.com/guardian/atom-maker/) for publishing, reindexing and saving atoms in a
DynamoDB. As a result there is the concept of Drafts (atoms where all fields are optional) and Atoms where whether or not a
field is optional depends on the [thrift definition](https://github.com/guardian/content-atom). Using `Drafts` is optional
a project can create `Atoms` directly in the `Preview` stage rather than creating a `Draft` first.

There are 3 stages an atom can be in:
`Draft`, `Preview` or `Live`. The `Draft` stage is optional.
### Draft
Not all of the fields required to publish an atom have been supplied. This stage allows atoms to be saved as a work in progress rather than
having to fill in all of fields of the atom that are required according to the thrift definition for atoms.
### Preview
At this stage an atom is ready to be published but has not yet been published. The purpose is to allow atoms to be previewed in their
complete state by editorial before they go live.
### Live
At this stage an atom has been published. It can be seen on the site in any content it has been embedded in.

## Publishing flow
1. Create atom
2. The atom is saved in Draft form in the DraftsDynamoDataStore while the user has not filled out all the fields required according to the thrift
definition. This enables the user to save their work at any point. At this point in the flow the atom is not in [Content API](http://open-platform.theguardian.com/documentation/).
3. Every time an atom is saved to the DraftsDynamoDataStore atom workshop also checks if all the required fields have been
supplied. If they have the atom is put in PreviewDynamoDataStore and put into preview CAPI. This step is not visible to the user.
4. The atom is now in a publishable state. The 'publish' button in the UI becomes active.
5. On selecting 'Publish' the atom is put in the PublishedDynamoDataStore and in live CAPI. Once published the atom can be embedded in
composer content.

## Editing Rules
When editing an atom what is saved where and when?
Note: When referring to automatic save, the save is automatic from the user's perspective. The only manual step for the user is publishing.
### Scenario 1: An atom is in drafts only
Changes are automatically saved to DraftsDynamoDataStore. If the changes have made the atom valid according to the thrift definition,
i.e. all required fields are provided, the atom is also saved to PreviewDynamoDataStore and preview CAPI is updated
to include the atom. The user does not have to do anything to transition the atom from Drafts to Preview. It is possible to publish the atom
once it is in Preview.
### Scenario 2: An atom is in preview and the edit process makes the atom invalid
If the changes make the atom invalid e.g. deleting the content of a required field the automatic save process will also remove the atom from
PreviewDynamoDataStore and preview CAPI. Changes are saved to DraftsDynamoDataStore only. It is not possible to publish the atom.
### Scenario 3: An atom is in preview and after the edit process the atom is still valid
If the atom is still valid after editing changes are automatically saved in DraftsDynamoDataStore and PreviewDynamoDataStore. Preview CAPI
is updated to reflect the changes made. It is possible to publish the atom.
### Scenario 4: An atom is live and the edit process makes the atom invalid
If the changes make the atom invalid e.g. deleting the content of a required field it will not be possible to republish the atom.
The atom will remain in live CAPI as it was ***before the edit took place.*** The automatic save process will remove the atom from
PreviewDynamoDataStore and preview CAPI. The changes are saved to DraftsDynamoDataStore only. Further editing to make the atom
valid will be required before it is possible to republish.
### Scenario 5: An atom is live and after the edit process the atom is still valid
If the atom is still valid after editing changes are automatically saved in DraftsDynamoDataStore and PreviewDynamoDataStore. Preview CAPI
is updated to reflect the changes made. To see the changes live the atom must be manually republished.