#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkAuroraServerlessStack } from '../lib/cdk-aurora-serverless-stack';

const app = new cdk.App();
new CdkAuroraServerlessStack(app, 'CdkAuroraServerlessStack');
